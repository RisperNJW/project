const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const providerRoutes = require('./routes/providerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
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

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/providers', providerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Kenya Tourism Booking System API`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Local'}`);
});