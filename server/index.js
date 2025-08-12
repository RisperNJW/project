const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { monitor, monitorMiddleware, logger } = require('./utils/monitoring');
const { detectFraud, fraudRateLimit } = require('./middleware/fraudDetection');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supportRoutes = require('./routes/supportRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const providerRoutes = require('./routes/providerRoutes');

dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com'],
      styleSrc: ["'self'", 'trusted-cdn.com', "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'trusted-cdn.com'],
      connectSrc: ["'self'", 'api.payment-gateway.com'],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'same-origin' },
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(monitorMiddleware); // Request monitoring
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Data sanitization
app.use(mongoSanitize()); // NoSQL injection protection
app.use(xss()); // XSS protection

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage',
    'maxGroupSize', 'difficulty', 'price'
  ]
}));

// Add security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Set referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Set feature policy
  res.setHeader('Feature-Policy', "geolocation 'self'; microphone 'none'; camera 'none'");
  
  // Set permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
  
  next();
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// 2) ROUTES
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes with security middleware
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/bookings', 
  detectFraud, // Fraud detection for booking endpoints
  fraudRateLimit, // Stricter rate limiting for booking
  bookingRoutes
);

app.use('/api/v1/payments', 
  detectFraud, // Enhanced fraud detection for payments
  paymentRoutes
);

app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/providers', providerRoutes);

// API documentation route
app.use('/api-docs', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/your-api-docs');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Kenya Tourism Booking System API',
    version: '2.0.0',
    features: [
      'Cart-based booking system',
      'Stripe & M-Pesa payments',
      'Provider management',
      'AI chatbot assistant',
      'Enhanced dashboards'
    ],
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      cart: '/api/cart',
      bookings: '/api/bookings',
      payments: '/api/payments',
      chat: '/api/chat',
      providers: '/api/providers'
    }
  });
});

// 3) ERROR HANDLING
// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// 4) SERVER SETUP
const httpServer = createServer(app);

// WebSocket setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Increase timeout for long polling
  pingTimeout: 60000,
  pingInterval: 25000
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join a room for private messaging
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  // Handle chat messages
  socket.on('sendMessage', (data) => {
    io.to(data.recipientId).emit('receiveMessage', data);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Store the io instance in the app for use in routes
app.set('io', io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Run security tests in development
  if (process.env.NODE_ENV === 'development') {
    const { exec } = require('child_process');
    console.log('Running security tests...');
    
    exec('node ./server/utils/securityTest.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running security tests: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Security tests stderr: ${stderr}`);
        return;
      }
      console.log(`Security tests output: ${stdout}`);
    });
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  
  // Close server & exit process
  httpServer.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  
  // Close server & exit process
  httpServer.close(() => {
    process.exit(1);
  });
});