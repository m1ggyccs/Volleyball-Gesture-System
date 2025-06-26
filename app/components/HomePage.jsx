"use client";
import React from 'react';
import { Monitor, Hand, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

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
            onClick={() => router.push('/watch')}
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

export default HomePage; 