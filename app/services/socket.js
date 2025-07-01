import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentMatchId = null;
    this.eventHandlers = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return this.socket;
    }

    console.log('🔌 Connecting to Socket.IO server...');
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket.IO error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('👋 Disconnecting Socket.IO...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentMatchId = null;
    }
  }

  joinMatch(matchId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    console.log(`👥 Joining match: ${matchId}`);
    this.currentMatchId = matchId;
    this.socket.emit('join-match', matchId);
  }

  leaveMatch() {
    if (this.socket && this.currentMatchId) {
      console.log(`👋 Leaving match: ${this.currentMatchId}`);
      this.socket.emit('leave-match', this.currentMatchId);
      this.currentMatchId = null;
    }
  }

  // Event handlers
  onMatchData(callback) {
    this.addEventHandler('match-data', callback);
  }

  onScoresUpdated(callback) {
    this.addEventHandler('scores-updated', callback);
  }

  onEventAdded(callback) {
    this.addEventHandler('event-added', callback);
  }

  onEventRemoved(callback) {
    this.addEventHandler('event-removed', callback);
  }

  onMatchReset(callback) {
    this.addEventHandler('match-reset', callback);
  }

  onGestureUpdate(callback) {
    this.addEventHandler('gesture-update', callback);
  }

  onAutoScoringToggled(callback) {
    this.addEventHandler('auto-scoring-toggled', callback);
  }

  onError(callback) {
    this.addEventHandler('error', callback);
  }

  addEventHandler(event, callback) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    // Remove existing handler if any
    this.removeEventHandler(event);
    
    // Add new handler
    this.socket.on(event, callback);
    this.eventHandlers.set(event, callback);
  }

  removeEventHandler(event) {
    if (this.socket && this.eventHandlers.has(event)) {
      this.socket.off(event, this.eventHandlers.get(event));
      this.eventHandlers.delete(event);
    }
  }

  // Emit events
  updateScores(scoreA, scoreB) {
    if (!this.socket || !this.currentMatchId) {
      console.error('Socket not connected or no match joined');
      return;
    }

    console.log(`📊 Emitting score update: ${scoreA} - ${scoreB}`);
    this.socket.emit('update-scores', {
      matchId: this.currentMatchId,
      scoreA,
      scoreB,
    });
  }

  addEvent(event) {
    if (!this.socket || !this.currentMatchId) {
      console.error('Socket not connected or no match joined');
      return;
    }

    console.log('📝 Emitting add event:', event);
    this.socket.emit('add-event', {
      matchId: this.currentMatchId,
      event,
    });
  }

  undoEvent() {
    if (!this.socket || !this.currentMatchId) {
      console.error('Socket not connected or no match joined');
      return;
    }

    console.log('↩️ Emitting undo event');
    this.socket.emit('undo-event', {
      matchId: this.currentMatchId,
    });
  }

  resetMatch() {
    if (!this.socket || !this.currentMatchId) {
      console.error('Socket not connected or no match joined');
      return;
    }

    console.log('🔄 Emitting reset match');
    this.socket.emit('reset-match', {
      matchId: this.currentMatchId,
    });
  }

  toggleAutoScoring(enabled) {
    if (!this.socket || !this.currentMatchId) {
      console.error('Socket not connected or no match joined');
      return;
    }

    console.log(`⚙️ Emitting auto-scoring toggle: ${enabled}`);
    this.socket.emit('toggle-auto-scoring', {
      matchId: this.currentMatchId,
      enabled,
    });
  }

  sendGesture(gesture) {
    if (!this.socket || !this.currentMatchId) {
      console.error('Socket not connected or no match joined');
      return;
    }

    console.log(`👋 Emitting gesture: ${gesture}`);
    this.socket.emit('gesture-detected', {
      matchId: this.currentMatchId,
      gesture,
    });
  }

  // Utility methods
  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  getCurrentMatchId() {
    return this.currentMatchId;
  }
}

// Create singleton instance
export const socketService = new SocketService(); 