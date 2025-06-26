"use client";
import React from 'react';
import { Tv, Hand, Camera, BarChart } from 'lucide-react';
import { useApp } from './AppContext';

const WatchPage = () => {
  const { gestureDetection, setGestureDetection, currentGesture, setCurrentGesture } = useApp();

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
          {/* Main Video Area */}
          <div className="col-span-8">
            {/* Video Player */}
            <div className="bg-gray-900 rounded-lg aspect-video relative overflow-hidden mb-4">
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/80 rounded px-3 py-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-white font-medium">Match Live</span>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <span className="text-gray-500 text-lg">📺 Volleyball Match Stream</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">Team Alpha</div>
                  <div className="text-4xl font-bold text-emerald-400">2</div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-400 text-sm">SET 3</div>
                </div>
                
                <div className="text-right">
                  <div className="text-4xl font-bold text-emerald-400">1</div>
                  <div className="text-2xl font-bold text-white">Team Beta</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Gesture Detection Panel */}
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