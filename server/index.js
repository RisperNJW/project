import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import winston from 'winston';
import http from 'http';

// Import routes
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
// import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { auth } from './middleware/auth.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'Go2Bookimgs' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/admin', auth, adminRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('join-chat', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('send-message', async (data) => {
    // Handle AI chat messages
    io.to(`user-${data.userId}`).emit('receive-message', data);
  });
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((error) => logger.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { io };