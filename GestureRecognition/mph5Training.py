import os
import cv2
import numpy as np
import mediapipe as mp
from ultralytics import YOLO
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Updated gesture classes to match your actual folder names
GESTURE_CLASSES = ['DynamicChangeOfCourt', 'DynamicServeLeft', 'DynamicServeRight', 'StaticBallOut', 'StaticEndOfMatch', 'StaticPointLeft', 'StaticPointRight']
SEQUENCE_LENGTH = 30
HAND_FEATURES = 84  # 2 hands * 21 landmarks * 2 coords
POSE_FEATURES = 8   # shoulders and elbows
FEATURE_SIZE = HAND_FEATURES + POSE_FEATURES

# Load YOLOv9
yolo_model = YOLO('C:/paul/mandapsfolder/softeng_mediapipe_yolo_training/best.pt')

# Load MediaPipe
mp_hands = mp.solutions.hands
mp_pose = mp.solutions.pose
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5, min_tracking_confidence=0.5)
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

def extract_hand_landmarks(image, hand_bbox=None):
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    if hand_bbox is not None:
        x1, y1, x2, y2 = hand_bbox
        # Add bounds checking to prevent cropping errors
        h, w = rgb.shape[:2]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)
        if x2 > x1 and y2 > y1:  # Only crop if valid bbox
            rgb = rgb[y1:y2, x1:x2]
    
    result = hands.process(rgb)

    landmarks = []
    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            points = [coord for lm in hand_landmarks.landmark for coord in (lm.x, lm.y)]
            landmarks.append(points)

    while len(landmarks) < 2:
        landmarks.append([0.0] * 42)

    return np.array(landmarks[:2]).flatten()

def extract_pose_landmarks(image):
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    result = pose.process(rgb)
    if result.pose_landmarks:
        indices = [11, 12, 13, 14]  # shoulders and elbows
        return np.array([coord for i in indices for coord in (result.pose_landmarks.landmark[i].x, result.pose_landmarks.landmark[i].y)])
    return np.zeros(POSE_FEATURES)

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"❌ Could not open video: {video_path}")
        return []
    
    features, count = [], 0
    while count < 150:
        ret, frame = cap.read()
        if not ret:
            break
        
        try:
            results = yolo_model(frame)
            bbox = None
            if len(results[0].boxes) > 0:
                bbox = results[0].boxes[0].xyxy[0].cpu().numpy().astype(int)
            
            hand = extract_hand_landmarks(frame, bbox)
            pose_ = extract_pose_landmarks(frame)
            features.append(np.concatenate([hand, pose_]))
            count += 1
        except Exception as e:
            print(f"⚠️ Error processing frame {count}: {e}")
            continue
    
    cap.release()

    # Create sequences
    sequences = []
    if len(features) >= SEQUENCE_LENGTH:
        for i in range(len(features) - SEQUENCE_LENGTH + 1):
            sequences.append(features[i:i + SEQUENCE_LENGTH])
    else:
        print(f"⚠️ Not enough frames ({len(features)}) for sequence length {SEQUENCE_LENGTH}")
    
    return sequences

def prepare_dataset(dataset_path='C:/paul/mandapsfolder/softeng_mediapipe_yolo_training/'):
    X, y = [], []
    class_counts = {}
    
    # First, let's check what folders actually exist
    print(f"📂 Checking dataset path: {dataset_path}")
    if not os.path.exists(dataset_path):
        print(f"❌ Dataset path does not exist: {dataset_path}")
        return np.array([]), np.array([]).reshape(0, len(GESTURE_CLASSES)), {}
    
    available_folders = [f for f in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, f))]
    print(f"📁 Available folders: {available_folders}")
    
    for idx, cls in enumerate(GESTURE_CLASSES):
        folder = os.path.join(dataset_path, cls)
        if not os.path.isdir(folder):
            print(f"❌ Missing folder: {cls}")
            class_counts[cls] = 0
            continue
        
        print(f"📂 Processing {cls}...")
        video_files = [f for f in os.listdir(folder) if f.lower().endswith(('.mp4', '.mov', '.avi'))]
        print(f"   Found {len(video_files)} video files")
        
        sequences_for_class = 0
        for file in video_files:
            video_path = os.path.join(folder, file)
            print(f"   Processing: {file}")
            try:
                sequences = process_video(video_path)
                if sequences:
                    X.extend(sequences)
                    y.extend([idx] * len(sequences))
                    sequences_for_class += len(sequences)
                    print(f"   ✅ Added {len(sequences)} sequences")
                else:
                    print(f"   ⚠️ No sequences extracted from {file}")
            except Exception as e:
                print(f"   ⚠️ Error in {file}: {e}")
        
        class_counts[cls] = sequences_for_class
        print(f"   📊 Total sequences for {cls}: {sequences_for_class}")
    
    if len(X) == 0:
        return np.array([]), np.array([]).reshape(0, len(GESTURE_CLASSES)), class_counts
    
    return np.array(X), to_categorical(np.array(y), num_classes=len(GESTURE_CLASSES)), class_counts

def build_model():
    model = Sequential([
        LSTM(128, return_sequences=True, input_shape=(SEQUENCE_LENGTH, FEATURE_SIZE)),
        Dropout(0.2),
        LSTM(64, return_sequences=True),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(64, activation='relu'),
        Dropout(0.2),
        Dense(len(GESTURE_CLASSES), activation='softmax')
    ])
    model.compile(optimizer=Adam(0.001), loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def plot_training(history):
    fig, ((acc, loss), (lr, val_metrics)) = plt.subplots(2, 2, figsize=(15, 10))
    
    # Accuracy plot
    acc.plot(history.history['accuracy'], label='Train Accuracy', linewidth=2)
    acc.plot(history.history['val_accuracy'], label='Validation Accuracy', linewidth=2)
    acc.set_title("Model Accuracy", fontsize=14, fontweight='bold')
    acc.set_xlabel("Epoch")
    acc.set_ylabel("Accuracy")
    acc.legend()
    acc.grid(True, alpha=0.3)
    
    # Loss plot
    loss.plot(history.history['loss'], label='Train Loss', linewidth=2)
    loss.plot(history.history['val_loss'], label='Validation Loss', linewidth=2)
    loss.set_title("Model Loss", fontsize=14, fontweight='bold')
    loss.set_xlabel("Epoch")
    loss.set_ylabel("Loss")
    loss.legend()
    loss.grid(True, alpha=0.3)
    
    # Learning rate plot (if available)
    if 'lr' in history.history:
        lr.plot(history.history['lr'], label='Learning Rate', linewidth=2, color='orange')
        lr.set_title("Learning Rate", fontsize=14, fontweight='bold')
        lr.set_xlabel("Epoch")
        lr.set_ylabel("Learning Rate")
        lr.set_yscale('log')
        lr.legend()
        lr.grid(True, alpha=0.3)
    else:
        lr.text(0.5, 0.5, 'Learning Rate\nNot Tracked', ha='center', va='center', transform=lr.transAxes)
        lr.set_title("Learning Rate", fontsize=14, fontweight='bold')
    
    # Summary metrics
    final_train_acc = history.history['accuracy'][-1]
    final_val_acc = history.history['val_accuracy'][-1]
    final_train_loss = history.history['loss'][-1]
    final_val_loss = history.history['val_loss'][-1]
    
    summary_text = f"""Final Metrics:
    Train Accuracy: {final_train_acc:.4f}
    Val Accuracy: {final_val_acc:.4f}
    Train Loss: {final_train_loss:.4f}
    Val Loss: {final_val_loss:.4f}
    
    Overfitting Check:
    Acc Gap: {final_train_acc - final_val_acc:.4f}
    Loss Gap: {final_val_loss - final_train_loss:.4f}"""
    
    val_metrics.text(0.1, 0.5, summary_text, ha='left', va='center', transform=val_metrics.transAxes, 
                    fontsize=12, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue"))
    val_metrics.set_title("Training Summary", fontsize=14, fontweight='bold')
    val_metrics.axis('off')
    
    plt.tight_layout()
    plt.show()

def plot_confusion_matrix(y_true, y_pred, class_names):
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix', fontsize=16, fontweight='bold')
    plt.xlabel('Predicted', fontsize=12)
    plt.ylabel('Actual', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.show()
    
    return cm

def analyze_model_performance(model, X_test, y_test, class_names):
    print("\n" + "="*60)
    print("🎯 DETAILED MODEL PERFORMANCE ANALYSIS")
    print("="*60)
    
    # Make predictions
    y_pred_proba = model.predict(X_test, verbose=0)
    y_pred = np.argmax(y_pred_proba, axis=1)
    y_true = np.argmax(y_test, axis=1)
    
    # Overall accuracy
    overall_accuracy = accuracy_score(y_true, y_pred)
    print(f"\n📊 OVERALL ACCURACY: {overall_accuracy:.4f} ({overall_accuracy*100:.2f}%)")
    
    # Classification report
    print(f"\n📋 DETAILED CLASSIFICATION REPORT:")
    print("-" * 50)
    report = classification_report(y_true, y_pred, target_names=class_names, 
                                 output_dict=True, zero_division=0)
    
    # Display per-class metrics
    for i, class_name in enumerate(class_names):
        if class_name in report:
            precision = report[class_name]['precision']
            recall = report[class_name]['recall']
            f1_score = report[class_name]['f1-score']
            support = report[class_name]['support']
            
            print(f"{class_name:25} | Precision: {precision:.3f} | Recall: {recall:.3f} | F1: {f1_score:.3f} | Support: {support}")
    
    # Overall metrics
    print("-" * 50)
    print(f"{'MACRO AVERAGE':25} | Precision: {report['macro avg']['precision']:.3f} | Recall: {report['macro avg']['recall']:.3f} | F1: {report['macro avg']['f1-score']:.3f}")
    print(f"{'WEIGHTED AVERAGE':25} | Precision: {report['weighted avg']['precision']:.3f} | Recall: {report['weighted avg']['recall']:.3f} | F1: {report['weighted avg']['f1-score']:.3f}")
    
    # Confusion matrix analysis
    cm = plot_confusion_matrix(y_true, y_pred, class_names)
    
    # Per-class accuracy
    print(f"\n📈 PER-CLASS ACCURACY:")
    print("-" * 30)
    class_accuracies = cm.diagonal() / cm.sum(axis=1)
    for i, (class_name, acc) in enumerate(zip(class_names, class_accuracies)):
        if not np.isnan(acc):
            print(f"{class_name:25}: {acc:.3f} ({acc*100:.1f}%)")
        else:
            print(f"{class_name:25}: No samples")
    
    # Confidence analysis
    print(f"\n🎯 PREDICTION CONFIDENCE ANALYSIS:")
    print("-" * 40)
    max_confidences = np.max(y_pred_proba, axis=1)
    print(f"Average Confidence: {np.mean(max_confidences):.3f}")
    print(f"Median Confidence: {np.median(max_confidences):.3f}")
    print(f"Min Confidence: {np.min(max_confidences):.3f}")
    print(f"Max Confidence: {np.max(max_confidences):.3f}")
    
    # Confidence distribution
    high_conf = np.sum(max_confidences > 0.9)
    med_conf = np.sum((max_confidences > 0.7) & (max_confidences <= 0.9))
    low_conf = np.sum(max_confidences <= 0.7)
    
    print(f"\nConfidence Distribution:")
    print(f"High (>90%): {high_conf} samples ({high_conf/len(max_confidences)*100:.1f}%)")
    print(f"Medium (70-90%): {med_conf} samples ({med_conf/len(max_confidences)*100:.1f}%)")
    print(f"Low (<70%): {low_conf} samples ({low_conf/len(max_confidences)*100:.1f}%)")
    
    return {
        'overall_accuracy': overall_accuracy,
        'classification_report': report,
        'confusion_matrix': cm,
        'class_accuracies': class_accuracies,
        'confidence_stats': {
            'mean': np.mean(max_confidences),
            'median': np.median(max_confidences),
            'min': np.min(max_confidences),
            'max': np.max(max_confidences)
        }
    }

def main():
    print("🚀 Preparing dataset...")
    X, y, class_counts = prepare_dataset()
    print(f"✅ Data shape: X={X.shape}, y={y.shape}")
    
    # Display dataset statistics
    print(f"\n📊 DATASET STATISTICS:")
    print("-" * 30)
    total_sequences = sum(class_counts.values())
    for class_name, count in class_counts.items():
        percentage = (count / total_sequences * 100) if total_sequences > 0 else 0
        print(f"{class_name:25}: {count:4d} sequences ({percentage:5.1f}%)")
    print(f"{'TOTAL':25}: {total_sequences:4d} sequences")

    if len(X) == 0:
        print("❌ No data found. Please check:")
        print("1. Your dataset path is correct")
        print("2. Your folder names match the GESTURE_CLASSES")
        print("3. Your folders contain video files (.mp4, .mov, .avi)")
        print("4. Your YOLO model (best.pt) exists and works")
        return

    # Check if we have enough data for train/test split
    unique_labels = np.unique(y.argmax(axis=1))
    if len(unique_labels) < 2:
        print("❌ Need at least 2 different classes for training")
        return

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y.argmax(axis=1), random_state=42
    )
    
    print(f"\n📊 DATA SPLIT:")
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")

    model = build_model()
    print(f"\n🏗️ MODEL ARCHITECTURE:")
    model.summary()
    
    # Add callbacks for better training
    callbacks = [
        EarlyStopping(monitor='val_accuracy', patience=10, restore_best_weights=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-7)
    ]
    
    print("\n📈 Training model...")
    history = model.fit(
        X_train, y_train, 
        epochs=11, 
        batch_size=32, 
        validation_data=(X_test, y_test), 
        callbacks=callbacks,
        verbose=1
    )

    # Save model
    model_path = "GestureRecognition/TwoModels/gesture_model.h5"
    model.save(model_path)
    print(f"\n💾 Model saved to {model_path}")
    
    # Comprehensive performance analysis
    performance_metrics = analyze_model_performance(model, X_test, y_test, GESTURE_CLASSES)
    
    # Plot training history
    plot_training(history)
    
    # Final recommendation
    overall_acc = performance_metrics['overall_accuracy']
    print(f"\n🎖️ FINAL ASSESSMENT:")
    print("=" * 50)
    if overall_acc >= 0.95:
        print("🏆 EXCELLENT! Your model performs exceptionally well.")
    elif overall_acc >= 0.85:
        print("✅ GOOD! Your model performs well for most gestures.")
    elif overall_acc >= 0.70:
        print("⚠️  FAIR! Your model works but could use improvement.")
    else:
        print("❌ POOR! Your model needs significant improvement.")
    
    print(f"\nRecommendations:")
    if overall_acc < 0.85:
        print("- Collect more training data")
        print("- Ensure consistent gesture performance")
        print("- Check for data imbalance between classes")
        print("- Consider data augmentation techniques")
    
    avg_confidence = performance_metrics['confidence_stats']['mean']
    if avg_confidence < 0.8:
        print("- Model predictions have low confidence")
        print("- Consider adjusting confidence threshold in real-time detection")

if __name__ == "__main__":
    main()