"use client";
import React, { useState } from "react";
import { useApp } from "../components/AppContext";

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
  const { currentMatch, setCurrentMatch } = useApp();
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