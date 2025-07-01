"use client";
import React, { useState, useEffect } from 'react';
import { Tv, Hand, Camera, BarChart } from 'lucide-react';
import { useApp } from './AppContext';

const WatchPage = () => {
  const { gestureDetection, setGestureDetection, currentGesture, setCurrentGesture, currentMatch, eventLog } = useApp();
  const [focus, setFocus] = useState('match'); // 'match' or 'gesture'

  useEffect(() => {
    if (!gestureDetection) return;
    const ws = new window.WebSocket('ws://localhost:8000/ws/gesture');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setCurrentGesture(data.gesture || 'No gesture detected');
      } catch (e) {
        setCurrentGesture('No gesture detected');
      }
    };
    ws.onerror = () => setCurrentGesture('No gesture detected');
    return () => ws.close();
  }, [gestureDetection, setCurrentGesture]);

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
        <div className="flex flex-row items-start gap-6">
          {/* Tab Switcher Sidebar */}
          <div className="flex flex-col items-start pt-0">
            <button
              className={`w-full px-4 py-3 mb-2 rounded-l-lg font-semibold transition-colors focus:outline-none text-left ${focus === 'match' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setFocus('match')}
            >
              Match
            </button>
            <button
              className={`w-full px-4 py-3 rounded-l-lg font-semibold transition-colors focus:outline-none text-left ${focus === 'gesture' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setFocus('gesture')}
            >
              Gesture
            </button>
          </div>
          {/* Main Area with Focus Switcher */}
          <div className="flex-1 min-w-0">
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
                {/* Match Info - now shows title and scores only */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-white mb-2">{currentMatch.title}</div>
                    <div className="flex items-center space-x-8 mb-4">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-gray-300">{currentMatch.teamA}</span>
                        <span className="text-3xl font-bold text-emerald-400">{currentMatch.scoreA}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-400">vs</span>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-gray-300">{currentMatch.teamB}</span>
                        <span className="text-3xl font-bold text-emerald-400">{currentMatch.scoreB}</span>
                      </div>
                    </div>
                    {/* Event/Call History Grid */}
                    <div className="w-full mt-4">
                      <div className="text-lg font-bold text-white mb-2">Call/Event History</div>
                      {eventLog.length === 0 ? (
                        <div className="text-gray-400 text-center py-4">No events yet.</div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 bg-gray-800 rounded-lg p-2 text-center text-gray-300 text-sm font-semibold">
                          <div>Time</div>
                          <div>Call</div>
                          <div>Who Scored</div>
                          <div>Score</div>
                        </div>
                      )}
                      {eventLog.length > 0 && (
                        <div className="divide-y divide-gray-700">
                          {eventLog.map((event, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-2 p-2 text-center items-center text-gray-200">
                              <div>{event.time}</div>
                              <div>{event.refCall}</div>
                              <div>{event.whoScored}</div>
                              <div>{event.scoreA} - {event.scoreB}</div>
                            </div>
                          ))}
                        </div>
                      )}
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
                  {/* Controls removed as requested */}
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
          <div className="w-[340px] flex-shrink-0 space-y-6">
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
                {/* Controls removed as requested */}
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
                {/* Match Info - compact, title and scores only */}
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-white">{currentMatch.title}</div>
                  <div className="flex items-center justify-center space-x-6 mt-2">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-300">{currentMatch.teamA}</span>
                      <span className="text-xl font-bold text-emerald-400">{currentMatch.scoreA}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-400">vs</span>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-300">{currentMatch.teamB}</span>
                      <span className="text-xl font-bold text-emerald-400">{currentMatch.scoreB}</span>
                    </div>
                  </div>
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
                  <span className="text-gray-400">Total Points</span>
                  <span className="text-white">{(currentMatch.scoreA || 0) + (currentMatch.scoreB || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aces</span>
                  <span className="text-white">{typeof currentMatch.aces !== 'undefined' ? currentMatch.aces : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blocks</span>
                  <span className="text-white">{typeof currentMatch.blocks !== 'undefined' ? currentMatch.blocks : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Errors</span>
                  <span className="text-white">{typeof currentMatch.errors !== 'undefined' ? currentMatch.errors : 0}</span>
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