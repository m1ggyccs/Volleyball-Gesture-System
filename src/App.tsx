import React from 'react';
import './App.css';
import VideoFeed from './components/VideoFeed';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Volleyball Referee Hand Signals Detection</h1>
      </header>
      <main>
        <VideoFeed />
      </main>
    </div>
  );
}

export default App;
