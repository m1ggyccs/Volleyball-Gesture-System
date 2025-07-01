"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../services/socket';
import { apiService } from '../services/api';

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
  const [gestureDetection, setGestureDetection] = useState(false);
  const [currentGesture, setCurrentGesture] = useState('No gesture detected');
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState({
    matchId: 'default-match',
    videoId: 'dQw4w9WgXcQ',
    title: 'Brazil vs Japan - FIVB World Championship',
    duration: '2:15:30',
    viewers: 1246,
    live: true,
    teamA: 'Brazil',
    teamB: 'Japan',
    scoreA: 0,
    scoreB: 0,
    setNumber: 1
  });
  const [eventLog, setEventLog] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState('default-match');

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to real-time server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from real-time server');
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Load matches from API
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const liveMatches = await apiService.getLiveMatches();
        setMatches(liveMatches);
        
        // If no live matches, create a default one
        if (liveMatches.length === 0) {
          const defaultMatch = await apiService.createMatch({
            title: 'Brazil vs Japan - FIVB World Championship',
            videoId: 'dQw4w9WgXcQ',
            teamA: 'Brazil',
            teamB: 'Japan',
            scoreA: 0,
            scoreB: 0,
            setNumber: 1,
            isLive: true
          });
          setCurrentMatch(defaultMatch);
          setCurrentMatchId(defaultMatch.matchId);
        } else {
          setCurrentMatch(liveMatches[0]);
          setCurrentMatchId(liveMatches[0].matchId);
        }
      } catch (error) {
        console.error('Error loading matches:', error);
      }
    };

    loadMatches();
  }, []);

  // Join match room when currentMatchId changes
  useEffect(() => {
    if (currentMatchId && isConnected) {
      socketService.joinMatch(currentMatchId);
    }
  }, [currentMatchId, isConnected]);

  // Socket event handlers
  useEffect(() => {
    if (!isConnected) return;

    // Handle match data updates
    socketService.onMatchData((matchData) => {
      console.log('📊 Received match data:', matchData);
      setCurrentMatch(matchData);
      setEventLog(matchData.eventLog || []);
    });

    // Handle score updates
    socketService.onScoresUpdated(({ scoreA, scoreB }) => {
      console.log('📊 Scores updated:', scoreA, scoreB);
      setCurrentMatch(prev => ({ ...prev, scoreA, scoreB }));
    });

    // Handle event additions
    socketService.onEventAdded(({ event, updatedMatch }) => {
      console.log('📝 Event added:', event);
      setEventLog(updatedMatch.eventLog || []);
      setCurrentMatch(updatedMatch);
    });

    // Handle event removals
    socketService.onEventRemoved(({ removedEvent, updatedMatch }) => {
      console.log('↩️ Event removed:', removedEvent);
      setEventLog(updatedMatch.eventLog || []);
      setCurrentMatch(updatedMatch);
    });

    // Handle match reset
    socketService.onMatchReset((matchData) => {
      console.log('🔄 Match reset:', matchData);
      setCurrentMatch(matchData);
      setEventLog([]);
    });

    // Handle auto-scoring toggle
    socketService.onAutoScoringToggled(({ enabled }) => {
      console.log('⚙️ Auto-scoring toggled:', enabled);
      setCurrentMatch(prev => ({ ...prev, autoScoringEnabled: enabled }));
    });

    // Handle errors
    socketService.onError((error) => {
      console.error('❌ Socket error:', error);
    });

    return () => {
      // Cleanup event handlers
      socketService.removeEventHandler('match-data');
      socketService.removeEventHandler('scores-updated');
      socketService.removeEventHandler('event-added');
      socketService.removeEventHandler('event-removed');
      socketService.removeEventHandler('match-reset');
      socketService.removeEventHandler('auto-scoring-toggled');
      socketService.removeEventHandler('error');
    };
  }, [isConnected]);

  const contextValue = {
    gestureDetection,
    setGestureDetection,
    currentGesture,
    setCurrentGesture,
    matches,
    setMatches,
    currentMatch,
    setCurrentMatch,
    eventLog,
    setEventLog,
    isConnected,
    currentMatchId,
    setCurrentMatchId,
    socketService,
    apiService
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 