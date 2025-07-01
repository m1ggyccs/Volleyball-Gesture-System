"use client";
import React, { useState } from "react";
import { useApp } from "../components/AppContext";
import { Camera } from "lucide-react";

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
  const { currentMatch, setCurrentMatch, gestureDetection, setGestureDetection } = useApp();
  const [scoreA, setScoreA] = useState(currentMatch.scoreA || 0);
  const [scoreB, setScoreB] = useState(currentMatch.scoreB || 0);
  const [whoScored, setWhoScored] = useState("");
  const [refCall, setRefCall] = useState("");
  const [eventLog, setEventLog] = useState([]);

  const handleScore = (team, delta) => {
    if (team === "A") {
      setScoreA((prev) => Math.max(0, prev + delta));
    } else {
      setScoreB((prev) => Math.max(0, prev + delta));
    }
  };

  const handleAddEvent = () => {
    if (!whoScored || !refCall) return;
    const event = {
      time: new Date().toLocaleTimeString(),
      whoScored,
      refCall,
      scoreA,
      scoreB
    };
    setEventLog((prev) => [event, ...prev]);
    setCurrentMatch((prev) => ({ ...prev, scoreA, scoreB }));
    setWhoScored("");
    setRefCall("");
  };

  return (
    <div className="pt-16 min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-emerald-400">Game Observer</h1>
        {/* Video Row: Match and Gesture Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Match Video */}
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${currentMatch.videoId}?autoplay=0&rel=0&modestbranding=1`}
                title="Match Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-2 text-center">
              <span className="text-white font-semibold">Match Video</span>
            </div>
          </div>
          {/* Gesture Detection Webcam Feed (Placeholder) */}
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center w-full">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-2" />
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
            {/* Status */}
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${gestureDetection ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              <span className="text-lg text-gray-400">{gestureDetection ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-white font-semibold">Gesture Detection</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="mb-4">
            <div className="text-2xl font-bold mb-2">{currentMatch.title}</div>
            <div className="text-gray-400 mb-1">Set {currentMatch.setNumber || 1}</div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xl font-bold">{currentMatch.teamA || "Team A"}</div>
              <div className="text-3xl font-bold text-emerald-400">{scoreA}</div>
              <div className="text-xl font-bold">{currentMatch.teamB || "Team B"}</div>
              <div className="text-3xl font-bold text-emerald-400">{scoreB}</div>
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
              <select
                value={refCall}
                onChange={(e) => setRefCall(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">Select...</option>
                {refereeCalls.map((call) => (
                  <option key={call} value={call}>{call}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAddEvent}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold mt-2"
            disabled={!whoScored || !refCall}
          >
            Add Event
          </button>
        </div>
        {/* Event Log */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Event Log</h2>
          {eventLog.length === 0 ? (
            <div className="text-gray-400">No events yet.</div>
          ) : (
            <ul className="space-y-2">
              {eventLog.map((event, idx) => (
                <li key={idx} className="bg-gray-800 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="font-semibold text-emerald-400">{event.time}</span> —
                    <span className="ml-2">{event.whoScored} scored ({event.refCall})</span>
                  </div>
                  <div className="mt-1 md:mt-0 text-sm text-gray-400">
                    Score: {currentMatch.teamA || "Team A"} {event.scoreA} - {event.scoreB} {currentMatch.teamB || "Team B"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObserverPage; 