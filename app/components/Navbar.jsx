"use client";
import React from 'react';
import { useApp } from './AppContext';

const Navbar = () => {
  const { currentPage, setCurrentPage } = useApp();

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 