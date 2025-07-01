# Volleyball Gesture System

**This project is part of our completion for the courses Software Engineering 1 and 2.**

## Overview

The Volleyball Gesture System is a real-time, collaborative web application for tracking, scoring, and analyzing volleyball matches using AI-powered gesture recognition. It features a modern Next.js frontend, a Node.js/Express backend with MongoDB, and a Python-based gesture recognition API using deep learning and computer vision.

## Features

- **Real-time Collaboration:** Multiple users (observers, admins, viewers) can interact with the same match data live.
- **Gesture Recognition:** AI models (YOLO, MediaPipe, Keras) detect volleyball referee gestures from webcam video, enabling automatic scoring and event logging.
- **Role-based UI:** 
  - **Observer:** Controls match events, reviews gestures, and manages scoring (manual and automatic).
  - **Admin:** Manages match metadata, teams, and video sources.
  - **Watch:** Viewers can watch the match, see live scores, and review event history.
- **WebSocket Communication:** Instant updates for all connected clients.
- **REST API:** Full CRUD for matches and events.
- **Event Logging:** Complete audit trail of match events.
- **YouTube Integration:** Embed and synchronize match videos.

## Project Structure

```
Volleyball-Gesture-System/
  app/                # Next.js frontend (pages, components, services)
  backend/            # Node.js/Express backend (API, WebSocket, MongoDB)
  GestureRecognition/ # Python FastAPI for gesture detection (YOLO, MediaPipe, Keras)
  public/             # Static assets
```

## Technology Stack

- **Frontend:** Next.js, React, Tailwind CSS, WebSockets
- **Backend:** Node.js, Express, MongoDB, Socket.IO
- **Gesture Recognition:** Python, FastAPI, OpenCV, MediaPipe, YOLO, TensorFlow/Keras

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python 3.8+
- MongoDB (local or Atlas)
- (Optional) CUDA for GPU acceleration

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Volleyball-Gesture-System
```

### 2. Install Dependencies

#### Frontend

```bash
cd app
npm install
```

#### Backend

```bash
cd ../backend
npm install
cp env.example .env
# Edit .env as needed
```

#### Gesture Recognition

```bash
cd ../GestureRecognition
pip install -r requirements.txt
```

### 3. Start Services

- **MongoDB:** Start your MongoDB server.
- **Backend:** `npm run dev` (in `backend/`)
- **Frontend:** `npm run dev` (in `app/`)
- **Gesture API:** `python gesture_api.py` (in `GestureRecognition/`)

### 4. Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Gesture API: [http://localhost:8000](http://localhost:8000)

## Usage

- **Admin Page:** Manage match details, teams, and video sources.
- **Observer Page:** Control scoring, add referee calls, and enable/disable gesture-based auto-scoring.
- **Watch Page:** View match video, live scores, and event history.

## Gesture Recognition

- Uses webcam video to detect referee gestures in real time.
- Models: YOLO (for detection), MediaPipe (for landmarks), Keras (for gesture classification).
- FastAPI serves gesture predictions and video stream to the frontend.

## API & WebSocket Endpoints

See `backend/README.md` for detailed API and WebSocket documentation.

## Environment Variables

- See `backend/env.example` for backend configuration.
- Gesture API does not require environment variables by default.

## Contributing

1. Fork the repo and create your branch.
2. Commit your changes.
3. Open a pull request.

---

**This project was developed as part of our coursework for Software Engineering 1 and 2.**
