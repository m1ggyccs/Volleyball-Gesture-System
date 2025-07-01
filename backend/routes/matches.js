const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { v4: uuidv4 } = require('uuid');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get live matches
router.get('/live', async (req, res) => {
  try {
    const liveMatches = await Match.find({ isLive: true }).sort({ lastUpdated: -1 });
    res.json(liveMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get match by ID
router.get('/:matchId', async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new match
router.post('/', async (req, res) => {
  try {
    const matchData = {
      ...req.body,
      matchId: uuidv4(),
      lastUpdated: new Date()
    };
    
    const match = new Match(matchData);
    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update match
router.put('/:matchId', async (req, res) => {
  try {
    const match = await Match.findOneAndUpdate(
      { matchId: req.params.matchId },
      { 
        ...req.body,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Emit real-time update to all clients in the match room
    const io = req.app.get('io');
    if (io) {
      io.to(match.matchId).emit('match-data', match);
    }
    
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add event to match
router.post('/:matchId/events', async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const event = {
      ...req.body,
      timestamp: new Date()
    };

    match.eventLog.unshift(event);
    match.lastUpdated = new Date();
    
    // Update scores if it's a scoring event
    if (event.refCall === 'Point Left') {
      match.scoreA = event.scoreA;
    } else if (event.refCall === 'Point Right') {
      match.scoreB = event.scoreB;
    }

    const savedMatch = await match.save();
    res.json(savedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update scores
router.patch('/:matchId/scores', async (req, res) => {
  try {
    const { scoreA, scoreB } = req.body;
    const match = await Match.findOneAndUpdate(
      { matchId: req.params.matchId },
      { 
        scoreA: scoreA,
        scoreB: scoreB,
        lastUpdated: new Date()
      },
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete match
router.delete('/:matchId', async (req, res) => {
  try {
    const match = await Match.findOneAndDelete({ matchId: req.params.matchId });
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 