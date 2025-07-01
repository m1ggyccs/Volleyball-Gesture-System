const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  whoScored: {
    type: String,
    required: true
  },
  refCall: {
    type: String,
    required: true
  },
  scoreA: {
    type: Number,
    required: true
  },
  scoreB: {
    type: Number,
    required: true
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  teamA: {
    type: String,
    required: true
  },
  teamB: {
    type: String,
    required: true
  },
  scoreA: {
    type: Number,
    default: 0
  },
  scoreB: {
    type: Number,
    default: 0
  },
  setNumber: {
    type: Number,
    default: 1
  },
  isLive: {
    type: Boolean,
    default: true
  },
  eventLog: [eventSchema],
  autoScoringEnabled: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Index for faster queries
matchSchema.index({ matchId: 1 });
matchSchema.index({ isLive: 1 });
matchSchema.index({ lastUpdated: -1 });

module.exports = mongoose.model('Match', matchSchema); 