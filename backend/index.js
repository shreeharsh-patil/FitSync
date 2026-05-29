require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitsync';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Joining a personal room for notifications
  socket.on('join-user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  // Global Feed: New Workout Post
  socket.on('new-post', (data) => {
    // Broadcast to all connected clients
    socket.broadcast.emit('feed-update', data);
    console.log('Broadcasting new post from:', data.author);
  });

  // Real-time Follow Notification
  socket.on('follow-user', (data) => {
    // Notify the user being followed
    // data: { followerName: string, followingId: string }
    io.to(data.followingId).emit('notification', {
      type: 'FOLLOW',
      message: `${data.followerName} is now following your training protocol!`,
      timestamp: new Date()
    });
  });

  // Group Workout / Challenge Sync
  socket.on('challenge-update', (data) => {
    socket.broadcast.emit('global-challenge-progress', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simple API Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FitSync Backend running on port ${PORT}`);
});
