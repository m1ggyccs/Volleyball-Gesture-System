require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const matchRoutes = require('./routes/matches');
const Match = require('./models/Match');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/matches', matchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Socket.IO connection handling
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Join a specific match room
  socket.on('join-match', async (matchId) => {
    socket.join(matchId);
    connectedClients.set(socket.id, matchId);
    console.log(`👥 Client ${socket.id} joined match: ${matchId}`);
    
    // Send current match data to the new client
    try {
      const match = await Match.findOne({ matchId });
      if (match) {
        socket.emit('match-data', match);
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
    }
  });

  // Handle score updates
  socket.on('update-scores', async (data) => {
    const { matchId, scoreA, scoreB } = data;
    console.log(`📊 Score update for match ${matchId}: ${scoreA} - ${scoreB}`);
    
    try {
      const match = await Match.findOneAndUpdate(
        { matchId },
        { 
          scoreA, 
          scoreB, 
          lastUpdated: new Date() 
        },
        { new: true }
      );
      
      if (match) {
        // Broadcast to all clients in the match room
        io.to(matchId).emit('scores-updated', { scoreA, scoreB });
      }
    } catch (error) {
      console.error('Error updating scores:', error);
      socket.emit('error', { message: 'Failed to update scores' });
    }
  });

  // Handle event additions
  socket.on('add-event', async (data) => {
    const { matchId, event } = data;
    console.log(`📝 Adding event to match ${matchId}:`, event);
    
    try {
      const match = await Match.findOne({ matchId });
      if (!match) {
        socket.emit('error', { message: 'Match not found' });
        return;
      }

      const newEvent = {
        ...event,
        timestamp: new Date()
      };

      match.eventLog.unshift(newEvent);
      match.lastUpdated = new Date();
      
      // Update scores if it's a scoring event
      if (event.refCall === 'Point Left') {
        match.scoreA = event.scoreA;
      } else if (event.refCall === 'Point Right') {
        match.scoreB = event.scoreB;
      }

      const savedMatch = await match.save();
      
      // Broadcast to all clients in the match room
      io.to(matchId).emit('event-added', {
        event: newEvent,
        updatedMatch: savedMatch
      });
    } catch (error) {
      console.error('Error adding event:', error);
      socket.emit('error', { message: 'Failed to add event' });
    }
  });

  // Handle event removal (undo)
  socket.on('undo-event', async (data) => {
    const { matchId } = data;
    console.log(`↩️ Undoing last event for match ${matchId}`);
    
    try {
      const match = await Match.findOne({ matchId });
      if (!match || match.eventLog.length === 0) {
        socket.emit('error', { message: 'No events to undo' });
        return;
      }

      const removedEvent = match.eventLog.shift();
      match.lastUpdated = new Date();
      
      // Revert scores if it was a scoring event
      if (removedEvent.refCall === 'Point Left') {
        match.scoreA = Math.max(0, match.scoreA - 1);
      } else if (removedEvent.refCall === 'Point Right') {
        match.scoreB = Math.max(0, match.scoreB - 1);
      }

      const savedMatch = await match.save();
      
      // Broadcast to all clients in the match room
      io.to(matchId).emit('event-removed', {
        removedEvent,
        updatedMatch: savedMatch
      });
    } catch (error) {
      console.error('Error undoing event:', error);
      socket.emit('error', { message: 'Failed to undo event' });
    }
  });

  // Handle match reset
  socket.on('reset-match', async (data) => {
    const { matchId } = data;
    console.log(`🔄 Resetting match ${matchId}`);
    
    try {
      const match = await Match.findOneAndUpdate(
        { matchId },
        { 
          scoreA: 0, 
          scoreB: 0, 
          eventLog: [],
          lastUpdated: new Date() 
        },
        { new: true }
      );
      
      if (match) {
        // Broadcast to all clients in the match room
        io.to(matchId).emit('match-reset', match);
      }
    } catch (error) {
      console.error('Error resetting match:', error);
      socket.emit('error', { message: 'Failed to reset match' });
    }
  });

  // Handle gesture detection
  socket.on('gesture-detected', (data) => {
    const { matchId, gesture } = data;
    console.log(`👋 Gesture detected for match ${matchId}: ${gesture}`);
    
    // Broadcast gesture to all clients in the match room
    io.to(matchId).emit('gesture-update', { gesture });
  });

  // Handle auto-scoring toggle
  socket.on('toggle-auto-scoring', async (data) => {
    const { matchId, enabled } = data;
    console.log(`⚙️ Auto-scoring ${enabled ? 'enabled' : 'disabled'} for match ${matchId}`);
    
    try {
      const match = await Match.findOneAndUpdate(
        { matchId },
        { 
          autoScoringEnabled: enabled,
          lastUpdated: new Date() 
        },
        { new: true }
      );
      
      if (match) {
        // Broadcast to all clients in the match room
        io.to(matchId).emit('auto-scoring-toggled', { enabled });
      }
    } catch (error) {
      console.error('Error toggling auto-scoring:', error);
      socket.emit('error', { message: 'Failed to toggle auto-scoring' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const matchId = connectedClients.get(socket.id);
    if (matchId) {
      console.log(`👋 Client ${socket.id} disconnected from match: ${matchId}`);
      connectedClients.delete(socket.id);
    } else {
      console.log(`👋 Client ${socket.id} disconnected`);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
});

module.exports = { app, server, io }; 