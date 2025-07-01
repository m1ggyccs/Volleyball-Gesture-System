import threading
import time
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
from testingModelWebcamOnly import GestureDetector
from fastapi.responses import StreamingResponse
import cv2

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_gesture = {"gesture": "No gesture detected", "confidence": 0.0}
latest_frame = None

def gesture_detection_thread():
    global latest_gesture, latest_frame
    model_path = "TwoModels/gesture_model.h5"
    yolo_path = "TwoModels/best.pt"
    detector = GestureDetector(model_path, yolo_path)
    for gesture, confidence, frame in detector.run_generator_with_frame():
        if gesture is not None:
            latest_gesture = {"gesture": gesture, "confidence": float(confidence)}
        else:
            latest_gesture = {"gesture": "No gesture detected", "confidence": 0.0}
        latest_frame = frame
        time.sleep(0.1)

def mjpeg_stream():
    global latest_frame
    while True:
        if latest_frame is not None:
            ret, jpeg = cv2.imencode('.jpg', latest_frame)
            if ret:
                frame_bytes = jpeg.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.05)

@app.on_event("startup")
def start_detection():
    thread = threading.Thread(target=gesture_detection_thread, daemon=True)
    thread.start()

@app.websocket("/ws/gesture")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(latest_gesture)
            await asyncio.sleep(0.2)
    except Exception:
        pass

@app.get('/video_feed')
def video_feed():
    return StreamingResponse(mjpeg_stream(), media_type='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    uvicorn.run("gesture_api:app", host="0.0.0.0", port=8000, reload=True) 