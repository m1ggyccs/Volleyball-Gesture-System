import React, { useEffect, useRef, useState } from 'react';
import './VideoFeed.css';

const VideoFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isStreaming]);

  return (
    <div className="video-feed-container">
      <div className="video-section">
        <div className="video-wrapper">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="video-element"
          />
          {!isStreaming && (
            <div className="video-placeholder">
              <p>Camera is off</p>
            </div>
          )}
        </div>
        <div className="controls">
          <button 
            className={`control-button ${isStreaming ? 'stop' : 'start'}`}
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>
      </div>
      
      <div className="detection-section">
        <div className="detection-card">
          <h3>Current Detection</h3>
          <div className="detection-result">
            <span className="signal">None</span>
          </div>
          <div className="confidence-meter">
            <div className="confidence-label">Confidence</div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: '0%' }}></div>
            </div>
            <span className="confidence-value">0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed; 