"use client";
import React, { createContext, useContext, useState } from 'react';

// Context for app state
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
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
    gestureDetection,
    setGestureDetection,
    currentGesture,
    setCurrentGesture,
    matches
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 