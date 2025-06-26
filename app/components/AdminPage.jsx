"use client";

import React from 'react';
import { Upload, Settings, Users, ChevronDown } from 'lucide-react';
import { useApp } from './AppContext';

const AdminPage = () => {
  const { currentMatch, setCurrentMatch } = useApp();
  const [form, setForm] = React.useState({
    videoId: currentMatch.videoId,
    title: currentMatch.title,
    duration: currentMatch.duration,
    viewers: currentMatch.viewers,
    live: currentMatch.live,
    teamA: currentMatch.teamA || 'Team Alpha',
    teamB: currentMatch.teamB || 'Team Beta',
    scoreA: currentMatch.scoreA || 0,
    scoreB: currentMatch.scoreB || 0,
    setNumber: currentMatch.setNumber || 1
  });
  const [saved, setSaved] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentMatch({ ...form });
    setSaved(true);
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage matches, gestures, and user access</p>
        </div>
        {/* Video Row: Match and Gesture Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Match Video */}
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${form.videoId}?autoplay=0&rel=0&modestbranding=1`}
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
              <span className="text-gray-500 text-lg">Webcam Feed (Gesture Detection)</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-white font-semibold">Gesture Detection</span>
            </div>
          </div>
        </div>
        {/* Side-by-side Match and Gesture Detection Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Match Details */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Match Details</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-400 mb-2">YouTube Video ID</label>
                <input
                  type="text"
                  name="videoId"
                  value={form.videoId}
                  onChange={handleChange}
                  placeholder="e.g. dQw4w9WgXcQ"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Match Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Championship Finals"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-gray-400 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2:15:30"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Viewers</label>
                <input
                  type="number"
                  name="viewers"
                  value={form.viewers}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="live"
                  checked={form.live}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-emerald-500"
                  id="liveCheckbox"
                />
                <label htmlFor="liveCheckbox" className="text-gray-400">Live</label>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors">
                Save Match
              </button>
              {saved && <div className="text-green-400 text-center mt-2">Match updated!</div>}
            </form>
          </div>
          {/* Gesture Detection (placeholder for now) */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Gesture Detection</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Gesture Name</label>
                <input
                  type="text"
                  placeholder="Point Left"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Gesture Type</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none appearance-none">
                    <option>Static</option>
                    <option>Dynamic</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Trigger Animation</label>
                <input
                  type="text"
                  placeholder="fadeIn"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors">
                Save Gesture
              </button>
            </div>
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
              <div className="text-3xl font-bold text-white">1,247</div>
              <div className="text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">89</div>
              <div className="text-gray-400">Active Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">3</div>
              <div className="text-gray-400">Admins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">15</div>
              <div className="text-gray-400">New Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 