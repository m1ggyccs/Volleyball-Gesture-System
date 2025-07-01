"use client";

import React from 'react';
import { Upload, Settings, Users, ChevronDown, Camera } from 'lucide-react';
import { useApp } from './AppContext';
import { apiService } from '../services/api';

const AdminPage = () => {
  const { currentMatch, setCurrentMatch, gestureDetection, setGestureDetection } = useApp();
  const [form, setForm] = React.useState({
    videoId: currentMatch.videoId,
    title: currentMatch.title,
    live: currentMatch.live,
    teamA: currentMatch.teamA || 'Team Alpha',
    teamB: currentMatch.teamB || 'Team Beta',
    scoreA: currentMatch.scoreA || 0,
    scoreB: currentMatch.scoreB || 0,
    setNumber: currentMatch.setNumber || 1
  });
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState('');

  // User management stats (replace with real data source if available)
  const totalUsers = 0;
  const activeViewers = 0;
  const adminCount = 0;
  const newToday = 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError('');
    try {
      // Sync with backend
      const updatedMatch = await apiService.updateMatch(currentMatch.matchId, form);
      setCurrentMatch(updatedMatch);
      setSaved(true);
    } catch (err) {
      setError('Failed to save match: ' + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">YouTube Video ID</label>
            <input
              type="text"
              name="videoId"
              value={form.videoId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              placeholder="e.g. dQw4w9WgXcQ"
            />
            {form.videoId && (
              <div className="mt-4 aspect-video rounded-lg overflow-hidden border border-gray-700">
                <iframe
                  src={`https://www.youtube.com/embed/${form.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title="Match Video Preview"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Match Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-2">Team A Name</label>
              <input
                type="text"
                name="teamA"
                value={form.teamA}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Team B Name</label>
              <input
                type="text"
                name="teamB"
                value={form.teamB}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-2">Team A Score</label>
              <input
                type="number"
                name="scoreA"
                value={form.scoreA}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Team B Score</label>
              <input
                type="number"
                name="scoreB"
                value={form.scoreB}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-2">Set Number</label>
              <input
                type="number"
                name="setNumber"
                value={form.setNumber}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="live"
              checked={form.live}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-400">Live</label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors"
          >
            Save Match
          </button>
          {saved && <div className="text-emerald-400 mt-2 text-center">Match saved!</div>}
          {error && <div className="text-red-400 mt-2 text-center">{error}</div>}
        </form>
        <div>
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Gesture Detection</h2>
            </div>
            {/* Webcam Feed Placeholder */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center w-full max-w-xl mb-6 mx-auto">
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
          </div>
          {/* User Management below */}
          <div className="bg-gray-900 rounded-lg p-6 lg:col-span-2 mt-8">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">User Management</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalUsers}</div>
                <div className="text-gray-400">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{activeViewers}</div>
                <div className="text-gray-400">Active Viewers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{adminCount}</div>
                <div className="text-gray-400">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{newToday}</div>
                <div className="text-gray-400">New Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 