"use client";
import React from 'react';
import { AppProvider, Navbar, HomePage, WatchPage, AdminPage } from './components';
import { useApp } from './components';

// Page Router Component
const PageRouter = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'watch':
      return <WatchPage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage />;
  }
};

// Main App Component
const VolleyVisionApp = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          <PageRouter />
        </main>
      </div>
    </AppProvider>
  );
};

export default VolleyVisionApp;