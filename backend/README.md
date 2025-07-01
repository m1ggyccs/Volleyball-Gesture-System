# Volleyball Gesture System Backend

Real-time collaborative backend for the Volleyball Gesture System with MongoDB and WebSocket support.

## 🚀 Features

- **Real-time Collaboration**: Multiple observers can view and update the same match simultaneously
- **MongoDB Database**: Persistent storage for matches, events, and scores
- **WebSocket Communication**: Real-time updates using Socket.IO
- **REST API**: Full CRUD operations for match management
- **Auto-scoring**: Automatic score updates based on gesture detection
- **Event Logging**: Complete audit trail of all match events

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd Volleyball-Gesture-System/backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/volleyball_gesture_system
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=your-secret-key-here
   ```

4. **Start MongoDB**:

   ```bash
   # If using MongoDB locally
   mongod

   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

## 🚀 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your .env file).

## 📡 API Endpoints

### Matches

- `GET /api/matches` - Get all matches
- `GET /api/matches/live` - Get live matches
- `GET /api/matches/:matchId` - Get specific match
- `POST /api/matches` - Create new match
- `PUT /api/matches/:matchId` - Update match
- `DELETE /api/matches/:matchId` - Delete match

### Events

- `POST /api/matches/:matchId/events` - Add event to match

### Scores

- `PATCH /api/matches/:matchId/scores` - Update match scores

### Health Check

- `GET /health` - Server health status

## 🔌 WebSocket Events

### Client to Server

- `join-match` - Join a specific match room
- `update-scores` - Update match scores
- `add-event` - Add new event
- `undo-event` - Remove last event
- `reset-match` - Reset match data
- `gesture-detected` - Send gesture detection
- `toggle-auto-scoring` - Toggle auto-scoring

### Server to Client

- `match-data` - Current match data
- `scores-updated` - Score update notification
- `event-added` - Event addition notification
- `event-removed` - Event removal notification
- `match-reset` - Match reset notification
- `gesture-update` - Gesture detection update
- `auto-scoring-toggled` - Auto-scoring toggle notification
- `error` - Error notifications

## 🗄️ Database Schema

### Match Document

```javascript
{
  matchId: String,           // Unique match identifier
  title: String,             // Match title
  videoId: String,           // YouTube video ID
  teamA: String,             // Team A name
  teamB: String,             // Team B name
  scoreA: Number,            // Team A score
  scoreB: Number,            // Team B score
  setNumber: Number,         // Current set number
  isLive: Boolean,           // Live match status
  eventLog: [Event],         // Array of events
  autoScoringEnabled: Boolean, // Auto-scoring toggle
  lastUpdated: Date,         // Last update timestamp
  createdBy: String,         // Creator identifier
  createdAt: Date,           // Creation timestamp
  updatedAt: Date            // Update timestamp
}
```

### Event Document

```javascript
{
  time: String,              // Event time
  whoScored: String,         // Team that scored
  refCall: String,           // Referee call type
  scoreA: Number,            // Team A score at event
  scoreB: Number,            // Team B score at event
  createdBy: String,         // Event creator
  timestamp: Date            // Event timestamp
}
```

## 🔧 Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origin
- `JWT_SECRET`: JWT secret for authentication (future use)

### MongoDB Connection

The backend supports both local MongoDB and MongoDB Atlas:

- **Local**: `mongodb://localhost:27017/volleyball_gesture_system`
- **Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/volleyball_gesture_system`

## 🧪 Testing

### Manual Testing

1. Start the server: `npm run dev`
2. Test health endpoint: `curl http://localhost:3001/health`
3. Create a match using the API
4. Connect multiple clients to test real-time updates

### WebSocket Testing

Use tools like:

- [Socket.IO Tester](https://chrome.google.com/webstore/detail/socket-io-tester/cgmimdpepcncnjgclhnhghdooepibakm)
- [Postman](https://www.postman.com/) (with WebSocket support)

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:

   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **CORS Errors**:

   - Update `CORS_ORIGIN` in `.env`
   - Ensure frontend URL is correct

3. **Port Already in Use**:

   - Change `PORT` in `.env`
   - Kill existing process: `lsof -ti:3001 | xargs kill -9`

4. **Socket.IO Connection Issues**:
   - Check firewall settings
   - Verify WebSocket support in browser
   - Check network connectivity

### Logs

The server provides detailed console logs for debugging:

- Connection events
- Database operations
- WebSocket events
- Error messages

## 🔒 Security Considerations

- **CORS**: Configured for specific origins
- **Input Validation**: All inputs are validated
- **Error Handling**: Comprehensive error handling
- **Rate Limiting**: Consider adding rate limiting for production
- **Authentication**: JWT support ready for future implementation

## 📈 Performance

- **Database Indexing**: Optimized queries with indexes
- **Connection Pooling**: MongoDB connection pooling
- **WebSocket Optimization**: Efficient real-time communication
- **Memory Management**: Proper cleanup and garbage collection

## 🔄 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production MongoDB
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use PM2 or similar process manager

### Docker (Future)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
