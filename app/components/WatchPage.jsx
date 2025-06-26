"use client";
import React, { useState } from 'react';
import { Tv, Hand, Camera, BarChart } from 'lucide-react';
import { useApp } from './AppContext';

const WatchPage = () => {
  const { gestureDetection, setGestureDetection, currentGesture, setCurrentGesture, currentMatch } = useApp();
  const [focus, setFocus] = useState('match'); // 'match' or 'gesture'

  const toggleDetection = () => {
    setGestureDetection(!gestureDetection);
    if (!gestureDetection) {
      setCurrentGesture('Point Left');
      setTimeout(() => setCurrentGesture('Ball Out'), 3000);
      setTimeout(() => setCurrentGesture('Point Right'), 6000);
    } else {
      setCurrentGesture('No gesture detected');
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Area with Focus Switcher */}
          <div className="col-span-8">
            {/* Focus Switcher */}
            <div className="flex space-x-2 mb-4">
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold transition-colors focus:outline-none ${focus === 'match' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setFocus('match')}
              >
                Match
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold transition-colors focus:outline-none ${focus === 'gesture' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setFocus('gesture')}
              >
                Gesture Detection
              </button>
            </div>

            {/* Main Content Area */}
            {focus === 'match' ? (
              <>
                {/* YouTube Video Player */}
                <div className="bg-gray-900 rounded-lg aspect-video relative overflow-hidden mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentMatch.videoId}?autoplay=0&rel=0&modestbranding=1`}
                    title="Volleyball Match"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Match Info */}
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <div className="text-2xl font-bold text-white">{currentMatch.title}</div>
                      <div className="text-gray-400 text-sm">Duration: {currentMatch.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 text-sm">LIVE STREAM</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 text-sm">Live</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">{currentMatch.viewers}</div>
                      <div className="text-gray-400 text-sm">Viewers</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Gesture Detection Main Panel (large) */}
                <div className="bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center aspect-video mb-4">
                  <div className="flex items-center space-x-2 mb-6">
                    <Hand className="w-8 h-8 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white">Gesture Detection</h2>
                  </div>
                  {/* Webcam Feed */}
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center w-full max-w-xl mb-6">
                    <div className="text-center w-full">
                      <Camera className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                      <span className="text-gray-500 text-lg">Webcam Feed</span>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="flex space-x-2 mb-6">
                    <button
                      onClick={toggleDetection}
                      className="flex-1 py-3 px-8 bg-emerald-500 hover:bg-emerald-600 rounded font-medium transition-colors text-lg"
                    >
                      {gestureDetection ? 'Stop Detection' : 'Start Detection'}
                    </button>
                    <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-lg">
                      Settings
                    </button>
                  </div>
                  {/* Status */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${gestureDetection ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                    <span className="text-lg text-gray-400">{gestureDetection ? 'Active' : 'Inactive'}</span>
                  </div>
                  {/* Current Gesture */}
                  <div className="bg-gray-800 rounded-lg p-6 text-center w-full max-w-md">
                    <div className="text-emerald-400 font-bold text-2xl">{currentGesture}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar (always visible, but swaps compact panel) */}
          <div className="col-span-4 space-y-6">
            {focus === 'match' ? (
              // Compact Gesture Detection Panel
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Hand className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Gesture Detection</h3>
                </div>
                {/* Webcam Feed */}
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <span className="text-gray-500 text-sm">Webcam Feed</span>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={toggleDetection}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-medium transition-colors"
                  >
                    {gestureDetection ? 'Stop Detection' : 'Start Detection'}
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                    Settings
                  </button>
                </div>
                {/* Status */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${gestureDetection ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-400">{gestureDetection ? 'Active' : 'Inactive'}</span>
                </div>
                {/* Current Gesture */}
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-emerald-400 font-bold text-lg">{currentGesture}</div>
                </div>
              </div>
            ) : (
              // Compact Match (YouTube) Panel
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Tv className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Match</h3>
                </div>
                {/* Compact YouTube Video */}
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4 overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentMatch.videoId}?autoplay=0&rel=0&modestbranding=1`}
                    title="Compact Volleyball Match"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Match Info */}
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-white">{currentMatch.title}</div>
                  <div className="text-gray-400 text-sm">Duration: {currentMatch.duration}</div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-sm">Live</span>
                </div>
              </div>
            )}

            {/* Match Statistics */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Match Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">1:23:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Points</span>
                  <span className="text-white">68</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aces</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blocks</span>
                  <span className="text-white">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Errors</span>
                  <span className="text-white">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Viewers</span>
                  <span className="text-white">1,246</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;