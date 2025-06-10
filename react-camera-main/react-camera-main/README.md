# Volleyball Referee Hand Signals Detection

A web application that uses computer vision and machine learning to detect and interpret volleyball referee hand signals in real-time.

## Features

- Real-time video feed from webcam
- Hand signal detection using YOLO, MediaPipe, and LSTM
- Live confidence scoring
- Clean and intuitive user interface

## Technologies Used

- React.js
- TypeScript
- YOLO (for object detection)
- MediaPipe (for hand tracking)
- LSTM (for sequence prediction)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd my-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
my-react-app/
├── src/
│   ├── components/
│   │   ├── VideoFeed.tsx
│   │   └── VideoFeed.css
│   ├── App.tsx
│   └── App.css
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
