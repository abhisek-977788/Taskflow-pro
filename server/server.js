require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');
const { verifySocket } = require('./middleware/auth');

// Connect DB
connectDB();

const app = express();
const server = http.createServer(app);

app.set('trust proxy', 1);

const parseOrigins = (value) => (value || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = parseOrigins(process.env.CLIENT_URL);
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
}

const validateCorsOrigin = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`Origin ${origin} is not allowed by CORS`));
};

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: validateCorsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Make io accessible in controllers
app.set('io', io);

// Socket.io JWT middleware
io.use(verifySocket);

// Socket connection handler
io.on('connection', (socket) => {
  const userId = socket.userId;
  console.log(`🔌 Socket connected: ${socket.id} | User: ${userId}`);

  // Join user-specific room for targeted events
  socket.join(userId);

  socket.on('join:board', (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`📋 User ${userId} joined board ${boardId}`);
  });

  socket.on('leave:board', (boardId) => {
    socket.leave(`board:${boardId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`🔌 Socket disconnected: ${socket.id} | Reason: ${reason}`);
  });
});

// Security middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: validateCorsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'TaskFlow Pro API is running 🚀', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 TaskFlow Pro Server running on port ${PORT} | ENV: ${process.env.NODE_ENV}`);
});

module.exports = { app, server };
