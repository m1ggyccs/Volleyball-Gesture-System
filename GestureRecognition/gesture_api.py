import threading
import time
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
from testingModelWebcamOnly import GestureDetector

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_gesture = {"gesture": "No gesture detected", "confidence": 0.0}

def gesture_detection_thread():
    global latest_gesture
    model_path = "TwoModels/gesture_model.h5"
    yolo_path = "TwoModels/best.pt"
    detector = GestureDetector(model_path, yolo_path)
    for gesture, confidence in detector.run_generator():
        if gesture is not None:
            latest_gesture = {"gesture": gesture, "confidence": float(confidence)}
        else:
            latest_gesture = {"gesture": "No gesture detected", "confidence": 0.0}
        time.sleep(0.1)

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

if __name__ == "__main__":
    uvicorn.run("gesture_api:app", host="0.0.0.0", port=8000, reload=True) 