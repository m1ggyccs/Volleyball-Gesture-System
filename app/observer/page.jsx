"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "../components/AppContext";
import { Camera, ArrowLeft, ArrowRight, Circle, Pause, Repeat2, AlertTriangle, Undo2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const refereeCalls = [
  "Point Left",
  "Point Right",
  "Ball Out",
  "Timeout",
  "Substitution",
  "Net Touch",
  "Other"
];

const ObserverPage = () => {
  const { 
    currentMatch, 
    setCurrentMatch, 
    gestureDetection, 
    setGestureDetection, 
    currentGesture, 
    setCurrentGesture, 
    eventLog, 
    setEventLog,
    isConnected,
    socketService
  } = useApp();
  const [whoScored, setWhoScored] = useState("");
  const [refCall, setRefCall] = useState("");
  const [videoLoading, setVideoLoading] = useState(true);
  const [webcamLoading, setWebcamLoading] = useState(false);
  const [lastProcessedGesture, setLastProcessedGesture] = useState("");
  const [autoScoreNotification, setAutoScoreNotification] = useState("");
  // Use auto-scoring from currentMatch for real-time sync
  const autoScoringEnabled = currentMatch.autoScoringEnabled !== undefined ? currentMatch.autoScoringEnabled : true;

  useEffect(() => {
    setVideoLoading(true);
    const timer = setTimeout(() => setVideoLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [currentMatch.videoId]);

  // WebSocket connection for gesture detection
  useEffect(() => {
    if (!gestureDetection) return;
    
    const ws = new window.WebSocket('ws://localhost:8000/ws/gesture');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const gesture = data.gesture || 'No gesture detected';
        setCurrentGesture(gesture);
        
        // Process automatic scoring for point gestures
        if (gesture !== lastProcessedGesture && autoScoringEnabled) {
          handleAutomaticScoring(gesture);
          setLastProcessedGesture(gesture);
        }
      } catch (e) {
        setCurrentGesture('No gesture detected');
      }
    };
    
    ws.onerror = () => setCurrentGesture('No gesture detected');
    
    return () => ws.close();
  }, [gestureDetection, setCurrentGesture, lastProcessedGesture]);

  const handleAutomaticScoring = (gesture) => {
    if (!isConnected) {
      console.error('Not connected to server');
      return;
    }

    // Map gesture names to scoring actions
    const gestureToScore = {
      'StaticPointLeft': () => {
        // Point Left means Team A (left side) scored
        const newScoreA = currentMatch.scoreA + 1;
        const event = {
          time: new Date().toLocaleTimeString(),
          whoScored: currentMatch.teamA || "Team A",
          refCall: "Point Left",
          scoreA: newScoreA,
          scoreB: currentMatch.scoreB
        };
        
        socketService.addEvent(event);
        setAutoScoreNotification(`${currentMatch.teamA || "Team A"} scored! (Auto-detected)`);
        setTimeout(() => setAutoScoreNotification(""), 3000);
      },
      'StaticPointRight': () => {
        // Point Right means Team B (right side) scored
        const newScoreB = currentMatch.scoreB + 1;
        const event = {
          time: new Date().toLocaleTimeString(),
          whoScored: currentMatch.teamB || "Team B",
          refCall: "Point Right",
          scoreA: currentMatch.scoreA,
          scoreB: newScoreB
        };
        
        socketService.addEvent(event);
        setAutoScoreNotification(`${currentMatch.teamB || "Team B"} scored! (Auto-detected)`);
        setTimeout(() => setAutoScoreNotification(""), 3000);
      }
    };

    if (gestureToScore[gesture]) {
      gestureToScore[gesture]();
    }
  };

  const addEventToLog = (whoScored, refCall, scoreAValue = currentMatch.scoreA, scoreBValue = currentMatch.scoreB) => {
    if (!isConnected) {
      console.error('Not connected to server');
      return;
    }

    const event = {
      time: new Date().toLocaleTimeString(),
      whoScored,
      refCall,
      scoreA: scoreAValue,
      scoreB: scoreBValue
    };
    
    console.log('Adding event to log:', event);
    socketService.addEvent(event);
  };

  const handleScore = (team, delta) => {
    if (!isConnected) {
      console.error('Not connected to server');
      return;
    }

    if (team === "A") {
      const newScore = Math.max(0, currentMatch.scoreA + delta);
      socketService.updateScores(newScore, currentMatch.scoreB);
    } else {
      const newScore = Math.max(0, currentMatch.scoreB + delta);
      socketService.updateScores(currentMatch.scoreA, newScore);
    }
  };

  const handleAddEvent = () => {
    if (!whoScored || !refCall || !isConnected) return;
    
    const event = {
      time: new Date().toLocaleTimeString(),
      whoScored,
      refCall,
      scoreA: currentMatch.scoreA,
      scoreB: currentMatch.scoreB
    };
    
    socketService.addEvent(event);
    setWhoScored("");
    setRefCall("");
  };

  const handleUndoEvent = () => {
    if (eventLog.length === 0 || !isConnected) return;
    
    socketService.undoEvent();
  };

  const handleResetMatch = () => {
    if (!isConnected) {
      console.error('Not connected to server');
      return;
    }

    if (window.confirm('Are you sure you want to reset the match? This will clear all scores and events.')) {
      socketService.resetMatch();
      setWhoScored("");
      setRefCall("");
    }
  };

  const handleTestEvent = () => {
    if (!isConnected) {
      console.error('Not connected to server');
      return;
    }

    const testEvent = {
      time: new Date().toLocaleTimeString(),
      whoScored: "Test Team",
      refCall: "Test Call",
      scoreA: currentMatch.scoreA,
      scoreB: currentMatch.scoreB
    };
    console.log('Adding test event:', testEvent);
    socketService.addEvent(testEvent);
  };

  return (
    <div className="pt-16 min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-emerald-400">Game Observer</h1>
        
        {/* Auto-scoring Notification */}
        {autoScoreNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg mb-4 flex items-center justify-center"
          >
            <span className="font-semibold text-lg">{autoScoreNotification}</span>
          </motion.div>
        )}
        
        {/* Connection Status */}
        <div className={`px-6 py-2 rounded-lg mb-4 flex items-center justify-center ${
          isConnected ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <span className="text-sm">
            {isConnected ? '🟢 Connected to server' : '🔴 Disconnected from server'}
          </span>
        </div>
        {/* Video Row: Match and Gesture Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Match Video */}
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
              {videoLoading ? (
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" title="Loading video..." />
              ) : !currentMatch.videoId ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <Camera className="w-16 h-16 text-gray-600 mb-2" />
                  <span className="text-gray-400">No video available</span>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${currentMatch.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title="Match Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setVideoLoading(false)}
                ></iframe>
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-white font-semibold">Match Video</span>
            </div>
          </div>
          {/* Gesture Detection */}
          <div className="bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center w-full">
            {/* Status Bar */}
            <div className={`w-full h-2 rounded-t-lg mb-4 ${gestureDetection ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <h2 className="text-2xl font-bold text-white mb-4">Gesture Detection</h2>
            <div className={`w-full aspect-video rounded-lg flex items-center justify-center mb-4 ${gestureDetection ? 'border-4 border-emerald-500' : ''} bg-black`}>
              <div className="text-center w-full">
                {webcamLoading ? (
                  <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-2" title="Loading webcam..." />
                ) : gestureDetection ? (
                  <Camera className="w-16 h-16 text-emerald-400 mx-auto mb-2 animate-pulse" title="Webcam Active" />
                ) : (
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <Camera className="w-16 h-16 text-gray-600 mx-auto mb-2" title="Webcam Inactive" />
                  </motion.div>
                )}
                <span className="text-gray-500 text-lg">Webcam Feed</span>
              </div>
            </div>
            {/* Controls */}
            <div className="flex space-x-2 my-4 w-full">
              <button
                onClick={() => setGestureDetection(!gestureDetection)}
                className="flex-1 py-3 px-8 bg-emerald-500 hover:bg-emerald-600 rounded font-medium transition-colors text-lg"
              >
                {gestureDetection ? 'Stop Detection' : 'Start Detection'}
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-lg">
                Settings
              </button>
            </div>
            
            {/* Auto-scoring Toggle */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-gray-400 text-sm">Auto-scoring:</span>
                          <button
              onClick={() => {
                const newValue = !autoScoringEnabled;
                if (isConnected) {
                  socketService.toggleAutoScoring(newValue);
                }
              }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                autoScoringEnabled 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
              }`}
            >
              {autoScoringEnabled ? 'ON' : 'OFF'}
            </button>
            </div>
            {/* Status */}
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${gestureDetection ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              <span className="text-lg text-gray-400">{gestureDetection ? 'Active' : 'Inactive'}</span>
            </div>
            {/* Last Detected Gesture */}
            <div className="bg-gray-800 rounded-lg p-4 text-center w-full max-w-md mt-2">
              <div className="text-emerald-400 font-bold text-xl">{currentGesture || 'No gesture detected'}</div>
              {/* If you have confidence, add it here: <div className="text-gray-400 text-sm">Confidence: 0.92</div> */}
              {(currentGesture === 'StaticPointLeft' || currentGesture === 'StaticPointRight') && (
                <div className="text-yellow-400 text-sm mt-1 animate-pulse">
                  ⚡ Auto-scoring active
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-white font-semibold">Gesture Detection</span>
              <div className="text-gray-500 text-xs mt-1">
                Point Left/Right gestures auto-score
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="mb-4">
            <div className="text-2xl font-bold mb-2">{currentMatch.title}</div>
            <div className="text-gray-400 mb-1">Set {currentMatch.setNumber || 1}</div>
            {autoScoringEnabled && gestureDetection && (
              <div className="text-emerald-400 text-sm mb-2 flex items-center justify-center">
                <span className="mr-2">⚡</span>
                Auto-scoring active
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <div className="text-xl font-bold">{currentMatch.teamA || "Team A"}</div>
              <div className="text-3xl font-bold text-emerald-400">{currentMatch.scoreA}</div>
              <div className="text-xl font-bold">{currentMatch.teamB || "Team B"}</div>
              <div className="text-3xl font-bold text-emerald-400">{currentMatch.scoreB}</div>
            </div>
            <div className="flex justify-between gap-4 mb-2">
              <div className="flex flex-col items-center">
                <button onClick={() => handleScore("A", 1)} className="px-3 py-1 bg-emerald-500 rounded mb-1">+1</button>
                <button onClick={() => handleScore("A", -1)} className="px-3 py-1 bg-gray-700 rounded">-1</button>
              </div>
              <div className="flex flex-col items-center">
                <button onClick={() => handleScore("B", 1)} className="px-3 py-1 bg-emerald-500 rounded mb-1">+1</button>
                <button onClick={() => handleScore("B", -1)} className="px-3 py-1 bg-gray-700 rounded">-1</button>
              </div>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Who Scored?</label>
              <select
                value={whoScored}
                onChange={(e) => setWhoScored(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">Select...</option>
                <option value={currentMatch.teamA || "Team A"}>{currentMatch.teamA || "Team A"}</option>
                <option value={currentMatch.teamB || "Team B"}>{currentMatch.teamB || "Team B"}</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Referee Call</label>
              <div className="flex flex-wrap gap-2">
                <button type="button" title="Point Left (Referee signals left)" onClick={() => setRefCall('Point Left')} className={`p-2 rounded ${refCall === 'Point Left' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><ArrowLeft className="w-5 h-5" /></button>
                <button type="button" title="Point Right (Referee signals right)" onClick={() => setRefCall('Point Right')} className={`p-2 rounded ${refCall === 'Point Right' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><ArrowRight className="w-5 h-5" /></button>
                <button type="button" title="Ball Out" onClick={() => setRefCall('Ball Out')} className={`p-2 rounded ${refCall === 'Ball Out' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><Circle className="w-5 h-5" /></button>
                <button type="button" title="Timeout" onClick={() => setRefCall('Timeout')} className={`p-2 rounded ${refCall === 'Timeout' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><Pause className="w-5 h-5" /></button>
                <button type="button" title="Substitution" onClick={() => setRefCall('Substitution')} className={`p-2 rounded ${refCall === 'Substitution' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><Repeat2 className="w-5 h-5" /></button>
                <button type="button" title="Net Touch (Referee signals net touch)" onClick={() => setRefCall('Net Touch')} className={`p-2 rounded ${refCall === 'Net Touch' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><AlertTriangle className="w-5 h-5" /></button>
                <button type="button" title="Other (Unclassified call)" onClick={() => setRefCall('Other')} className={`p-2 rounded ${refCall === 'Other' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}><Circle className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddEvent}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold mt-2"
            disabled={!whoScored || !refCall}
          >
            Add Event
          </button>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleUndoEvent}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center justify-center"
              disabled={eventLog.length === 0}
              title="Undo Last Event"
            >
              <Undo2 className="w-5 h-5 mr-2" /> Undo Last Event
            </button>
            <button
              onClick={handleResetMatch}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold flex items-center justify-center"
              title="Reset Match"
            >
              <Repeat2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleTestEvent}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold flex items-center justify-center"
              title="Add Test Event"
            >
              Test
            </button>
          </div>
        </div>
        {/* Event Log */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Event Log</h2>
            <div className="text-sm text-gray-400">
              Events: {eventLog.length} | Connected: {isConnected ? 'Yes' : 'No'}
            </div>
          </div>
          {eventLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-gray-600 mb-2 animate-spin" />
              <span className="text-gray-400">No events yet. Start logging referee calls!</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-300">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Who Scored</th>
                    <th className="px-4 py-2 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {eventLog.map((event, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="px-4 py-2 whitespace-nowrap">{event.time}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{event.refCall}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{event.whoScored}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{event.scoreA} - {event.scoreB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObserverPage; 