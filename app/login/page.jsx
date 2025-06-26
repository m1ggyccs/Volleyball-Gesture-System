import React, { useState, createContext, useContext } from 'react';
import { Play, Users, BarChart3, Upload, Settings, Eye, Camera, Square, Circle, TrendingUp, User, Shield, LogOut, Menu, X, Home, Tv, UserCheck, Monitor, Hand, BarChart, ChevronDown } from 'lucide-react';

// Context for app state
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Main App Component
const VolleyVisionApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [gestureDetection, setGestureDetection] = useState(false);
  const [currentGesture, setCurrentGesture] = useState('No gesture detected');
  const [matches] = useState([
    { id: 1, title: 'Brazil vs Japan - FIVB World Championship', viewers: 12547, live: true },
    { id: 2, title: 'USA vs Italy - Olympic Qualifier', viewers: 8932, live: true },
    { id: 3, title: 'Poland vs Russia - European Championship', viewers: 6421, live: false }
  ]);

  const contextValue = {
    currentPage,
    setCurrentPage,
    user,
    setUser,
    gestureDetection,
    setGestureDetection,
    currentGesture,
    setCurrentGesture,
    matches
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'watch' && <WatchPage />}
          {currentPage === 'admin' && <AdminPage />}
          {currentPage === 'login' && <LoginPage />}
        </main>
      </div>
    </AppContext.Provider>
  );
};

// Navbar Component
const Navbar = () => {
  const { currentPage, setCurrentPage, user, setUser } = useApp();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'watch', label: 'Watch' },
    { id: 'admin', label: 'Admin' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-emerald-400">
            VolleyVision
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-lg transition-colors ${
                  currentPage === item.id 
                    ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white">{user.name}</span>
                <button
                  onClick={() => setUser(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-medium transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// HomePage Component
const HomePage = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-emerald-900/20 to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-8xl font-bold mb-6 text-emerald-400">
            VolleyVision
          </h1>
          <p className="text-2xl text-gray-400 mb-12">
            The Future of Volleyball Streaming
          </p>
          <button
            onClick={() => setCurrentPage('watch')}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-lg font-semibold transition-colors"
          >
            Watch Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">
            Revolutionary Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Live Match Viewer */}
            <div className="bg-gray-900 rounded-lg p-8 border-t-4 border-emerald-400">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-white">Live Match Viewer</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Stream volleyball matches in high quality with real-time commentary and multi-angle camera views
              </p>
            </div>

            {/* AI Gesture Detection */}
            <div className="bg-gray-900 rounded-lg p-8 border-t-4 border-emerald-400">
              <div className="w-20 h-20 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Hand className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-white">AI Gesture Detection</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Advanced MediaPipe technology detects referee gestures and provides instant visual feedback
              </p>
            </div>

            {/* Live Match Stats */}
            <div className="bg-gray-900 rounded-lg p-8 border-t-4 border-emerald-400">
              <div className="w-20 h-20 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <BarChart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-white">Live Match Stats</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Real-time statistics, player performance metrics, and detailed match analytics
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// WatchPage Component
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

// AdminPage Component
const AdminPage = () => {
  const { user } = useApp();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage matches, gestures, and user access</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Match */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Upload Match</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Match Title</label>
                <input
                  type="text"
                  placeholder="Championship Finals"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Video File</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4">
                  <button className="flex items-center space-x-2 text-gray-400">
                    <span className="px-3 py-1 bg-gray-700 rounded text-sm">Browse...</span>
                    <span>No file selected.</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Thumbnail</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4">
                  <button className="flex items-center space-x-2 text-gray-400">
                    <span className="px-3 py-1 bg-gray-700 rounded text-sm">Browse...</span>
                    <span>No file selected.</span>
                  </button>
                </div>
              </div>
              
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors">
                Upload Match
              </button>
            </div>
          </div>

          {/* Gesture Configuration */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Gesture Configuration</h2>
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

          {/* User Management */}
          <div className="bg-gray-900 rounded-lg p-6 lg:col-span-2">
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
    </div>
  );
};

// LoginPage Component
const LoginPage = () => {
  const { setUser, setCurrentPage } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'viewer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role
    };
    setUser(user);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">VolleyVision</h1>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-400 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center mb-4">Quick Demo:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setUser({ name: 'Demo Viewer', email: 'viewer@demo.com', role: 'viewer' });
                  setCurrentPage('home');
                }}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
              >
                Demo Viewer
              </button>
              <button
                onClick={() => {
                  setUser({ name: 'Demo Admin', email: 'admin@demo.com', role: 'admin' });
                  setCurrentPage('home');
                }}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 rounded transition-colors text-sm"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolleyVisionApp;