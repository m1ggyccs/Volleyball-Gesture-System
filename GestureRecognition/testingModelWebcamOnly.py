import cv2
import numpy as np
import mediapipe as mp
from ultralytics import YOLO
from tensorflow.keras.models import load_model
from collections import deque
import time

# Same configuration as training
GESTURE_CLASSES = ['DynamicChangeOfCourt', 'DynamicServeLeft', 'DynamicServeRight', 'StaticBallOut', 'StaticEndOfMatch', 'StaticPointLeft', 'StaticPointRight']
SEQUENCE_LENGTH = 30
HAND_FEATURES = 84
POSE_FEATURES = 8
FEATURE_SIZE = HAND_FEATURES + POSE_FEATURES

class GestureDetector:
    def __init__(self, model_path, yolo_path):
        # Load trained gesture model
        print("🔄 Loading gesture model...")
        self.gesture_model = load_model(model_path)
        print("✅ Gesture model loaded!")
        
        # Load YOLO model
        print("🔄 Loading YOLO model...")
        self.yolo_model = YOLO(yolo_path)
        print("✅ YOLO model loaded!")
        
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Feature buffer for sequence
        self.feature_buffer = deque(maxlen=SEQUENCE_LENGTH)
        
        # Prediction smoothing
        self.prediction_buffer = deque(maxlen=5)
        self.confidence_threshold = 0.7
        
        # Webcam capture
        self.cap = None
        
    def extract_hand_landmarks(self, image, hand_bbox=None):
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        if hand_bbox is not None:
            x1, y1, x2, y2 = hand_bbox
            h, w = rgb.shape[:2]
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)
            if x2 > x1 and y2 > y1:
                rgb = rgb[y1:y2, x1:x2]
        
        result = self.hands.process(rgb)
        
        landmarks = []
        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                points = [coord for lm in hand_landmarks.landmark for coord in (lm.x, lm.y)]
                landmarks.append(points)
        
        while len(landmarks) < 2:
            landmarks.append([0.0] * 42)
            
        return np.array(landmarks[:2]).flatten()
    
    def extract_pose_landmarks(self, image):
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        result = self.pose.process(rgb)
        
        if result.pose_landmarks:
            indices = [11, 12, 13, 14]  # shoulders and elbows
            return np.array([coord for i in indices 
                           for coord in (result.pose_landmarks.landmark[i].x, 
                                       result.pose_landmarks.landmark[i].y)])
        return np.zeros(POSE_FEATURES)
    
    def draw_landmarks(self, image, results_hands, results_pose):
        # Draw hand landmarks
        if results_hands.multi_hand_landmarks:
            for hand_landmarks in results_hands.multi_hand_landmarks:
                self.mp_drawing.draw_landmarks(
                    image, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)
        
        # Draw pose landmarks
        if results_pose.pose_landmarks:
            self.mp_drawing.draw_landmarks(
                image, results_pose.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)
    
    def predict_gesture(self):
        if len(self.feature_buffer) < SEQUENCE_LENGTH:
            return None, 0.0
        
        # Prepare sequence for prediction
        sequence = np.array(list(self.feature_buffer))
        sequence = sequence.reshape(1, SEQUENCE_LENGTH, FEATURE_SIZE)
        
        # Make prediction
        prediction = self.gesture_model.predict(sequence, verbose=0)[0]
        confidence = np.max(prediction)
        gesture_idx = np.argmax(prediction)
        
        # Add to prediction buffer for smoothing
        self.prediction_buffer.append((gesture_idx, confidence))
        
        # Smooth predictions
        if len(self.prediction_buffer) >= 3:
            recent_predictions = list(self.prediction_buffer)[-3:]
            # Get most common prediction with high confidence
            high_conf_predictions = [(idx, conf) for idx, conf in recent_predictions 
                                   if conf > self.confidence_threshold]
            
            if high_conf_predictions:
                # Get most frequent high-confidence prediction
                prediction_counts = {}
                for idx, conf in high_conf_predictions:
                    if idx not in prediction_counts:
                        prediction_counts[idx] = []
                    prediction_counts[idx].append(conf)
                
                if prediction_counts:
                    # Get prediction with highest average confidence
                    best_idx = max(prediction_counts.keys(), 
                                 key=lambda k: np.mean(prediction_counts[k]))
                    best_conf = np.mean(prediction_counts[best_idx])
                    return GESTURE_CLASSES[best_idx], best_conf
        
        return None, 0.0
    
    def run_generator(self):
        """Generator that yields gesture predictions continuously"""
        self.cap = cv2.VideoCapture(1)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        if not self.cap.isOpened():
            print("❌ Could not open webcam")
            return
        
        print("🎥 Starting gesture detection generator...")
        
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    print("❌ Could not read frame")
                    break
                
                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                
                try:
                    # YOLO detection for person/hand detection
                    yolo_results = self.yolo_model(frame, verbose=False)
                    bbox = None
                    if len(yolo_results[0].boxes) > 0:
                        bbox = yolo_results[0].boxes[0].xyxy[0].cpu().numpy().astype(int)
                    
                    # Extract features
                    hand_features = self.extract_hand_landmarks(frame, bbox)
                    pose_features = self.extract_pose_landmarks(frame)
                    combined_features = np.concatenate([hand_features, pose_features])
                    
                    # Add to buffer
                    self.feature_buffer.append(combined_features)
                    
                    # Predict gesture
                    gesture, confidence = self.predict_gesture()
                    
                    # Yield the result
                    yield gesture, confidence
                    
                except Exception as e:
                    print(f"⚠️ Error processing frame: {e}")
                    yield None, 0.0
                
                # Small delay to prevent overwhelming the system
                time.sleep(0.05)
                
        except KeyboardInterrupt:
            print("🛑 Gesture detection stopped by user")
        finally:
            if self.cap:
                self.cap.release()
    
    def run_generator_with_frame(self):
        """Generator that yields gesture, confidence, and annotated frame continuously"""
        self.cap = cv2.VideoCapture(1)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        if not self.cap.isOpened():
            print("❌ Could not open webcam")
            return
        
        print("🎥 Starting gesture detection generator with frame...")
        
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    print("❌ Could not read frame")
                    break
                
                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                annotated_frame = frame.copy()
                try:
                    # YOLO detection for person/hand detection
                    yolo_results = self.yolo_model(frame, verbose=False)
                    bbox = None
                    if len(yolo_results[0].boxes) > 0:
                        bbox = yolo_results[0].boxes[0].xyxy[0].cpu().numpy().astype(int)
                        # Draw bounding box
                        cv2.rectangle(annotated_frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
                    
                    # Extract features
                    hand_features = self.extract_hand_landmarks(frame, bbox)
                    pose_features = self.extract_pose_landmarks(frame)
                    combined_features = np.concatenate([hand_features, pose_features])
                    
                    # Add to buffer
                    self.feature_buffer.append(combined_features)
                    
                    # Draw landmarks for visualization
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    hands_results = self.hands.process(rgb_frame)
                    pose_results = self.pose.process(rgb_frame)
                    self.draw_landmarks(annotated_frame, hands_results, pose_results)
                    
                    # Predict gesture
                    gesture, confidence = self.predict_gesture()
                    
                    # Display information on frame
                    h, w, _ = annotated_frame.shape
                    buffer_status = f"Buffer: {len(self.feature_buffer)}/{SEQUENCE_LENGTH}"
                    cv2.putText(annotated_frame, buffer_status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                    if gesture and confidence > self.confidence_threshold:
                        prediction_text = f"Gesture: {gesture}"
                        confidence_text = f"Confidence: {confidence:.2f}"
                        cv2.rectangle(annotated_frame, (10, 60), (500, 120), (0, 255, 0), -1)
                        cv2.putText(annotated_frame, prediction_text, (15, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                        cv2.putText(annotated_frame, confidence_text, (15, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
                    else:
                        cv2.putText(annotated_frame, "Detecting...", (10, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                    
                    # Yield the result
                    yield gesture, confidence, annotated_frame
                    
                except Exception as e:
                    print(f"⚠️ Error processing frame: {e}")
                    yield None, 0.0, annotated_frame
                
                # Small delay to prevent overwhelming the system
                time.sleep(0.05)
                
        except KeyboardInterrupt:
            print("🛑 Gesture detection stopped by user")
        finally:
            if self.cap:
                self.cap.release()
    
    def run(self):
        cap = cv2.VideoCapture(1)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        if not cap.isOpened():
            print("❌ Could not open webcam")
            return
        
        print("🎥 Starting gesture detection...")
        print("📋 Gestures to detect:", GESTURE_CLASSES)
        print("⌨️  Press 'q' to quit, 'r' to reset buffer")
        
        fps_counter = 0
        start_time = time.time()
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Could not read frame")
                break
            
            # Flip frame horizontally for mirror effect
            frame = cv2.flip(frame, 1)
            
            try:
                # YOLO detection for person/hand detection
                yolo_results = self.yolo_model(frame, verbose=False)
                bbox = None
                if len(yolo_results[0].boxes) > 0:
                    bbox = yolo_results[0].boxes[0].xyxy[0].cpu().numpy().astype(int)
                    # Draw bounding box
                    cv2.rectangle(frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
                
                # Extract features
                hand_features = self.extract_hand_landmarks(frame, bbox)
                pose_features = self.extract_pose_landmarks(frame)
                combined_features = np.concatenate([hand_features, pose_features])
                
                # Add to buffer
                self.feature_buffer.append(combined_features)
                
                # Draw landmarks for visualization
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                hands_results = self.hands.process(rgb_frame)
                pose_results = self.pose.process(rgb_frame)
                self.draw_landmarks(frame, hands_results, pose_results)
                
                # Predict gesture
                gesture, confidence = self.predict_gesture()
                
                # Display information
                h, w, _ = frame.shape
                
                # Buffer status
                buffer_status = f"Buffer: {len(self.feature_buffer)}/{SEQUENCE_LENGTH}"
                cv2.putText(frame, buffer_status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                
                # Current prediction
                if gesture and confidence > self.confidence_threshold:
                    prediction_text = f"Gesture: {gesture}"
                    confidence_text = f"Confidence: {confidence:.2f}"
                    
                    # Green background for high confidence
                    cv2.rectangle(frame, (10, 60), (500, 120), (0, 255, 0), -1)
                    cv2.putText(frame, prediction_text, (15, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                    cv2.putText(frame, confidence_text, (15, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
                else:
                    cv2.putText(frame, "Detecting...", (10, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                
                # FPS counter
                fps_counter += 1
                if fps_counter % 30 == 0:
                    elapsed = time.time() - start_time
                    fps = fps_counter / elapsed
                    fps_counter = 0
                    start_time = time.time()
                
                # Instructions
                cv2.putText(frame, "Press 'q' to quit, 'r' to reset", (10, h-20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
            except Exception as e:
                print(f"⚠️ Error processing frame: {e}")
                cv2.putText(frame, f"Error: {str(e)[:50]}", (10, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            
            # Show frame
            cv2.imshow('Gesture Detection', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('r'):
                self.feature_buffer.clear()
                self.prediction_buffer.clear()
                print("🔄 Buffers reset")
        
        cap.release()
        cv2.destroyAllWindows()
        print("👋 Gesture detection stopped")

def main():
    # Paths to your models - updated to use relative paths
    model_path = "TwoModels/gesture_model.h5"
    yolo_path = "TwoModels/best.pt"

    # Check if models exist
    import os
    if not os.path.exists(model_path):
        print(f"❌ Gesture model not found: {model_path}")
        print("Please make sure your training completed successfully")
        return
    
    if not os.path.exists(yolo_path):
        print(f"❌ YOLO model not found: {yolo_path}")
        return
    
    # Create detector and run
    detector = GestureDetector(model_path, yolo_path)
    detector.run()

if __name__ == "__main__":
    main()