const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const newsScheduler = require('./services/newsSchedulerService');
const unifiedNewsScheduler = require('./services/unifiedNewsScheduler');
const websocketService = require('./services/websocketService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://baltar-inc.vercel.app', // Your Vercel domain
    'https://*.vercel.app', // Any Vercel preview deployments
    /\.vercel\.app$/ // Regex for Vercel domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow Vercel to fetch
}));

// Rate limiting — global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again in 15 minutes.' },
});
app.use('/api/auth', authLimiter);

// Stripe webhook needs raw body, so add it before express.json()
app.use('/api/stripe', require('./routes/stripeWebhookRoutes'));

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Use subservice routes
app.use('/api/frontend', require('./routes/frontendWebDesign'));

// Core business routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/consumer-pulse', require('./routes/consumerPulseRoutes'));
app.use('/api/le-mode-co', require('./routes/leModeCoRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Baltar Backend is up and running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Initialize Consumer Pulse with all news APIs and WebSocket
const initializeConsumerPulse = async () => {
  try {
    console.log('🔄 Initializing Consumer Pulse with unified news system...');

    // Initialize WebSocket service
    websocketService.initialize(server);
    websocketService.startHeartbeat();

    // Start the unified news scheduler (all APIs)
    unifiedNewsScheduler.startScheduler();

    // Keep the old NewsData.io scheduler as backup
    // newsScheduler.startScheduler();

    console.log('✅ Consumer Pulse initialized with:');
    console.log('   📡 WebSocket service for real-time updates');
    console.log('   🔄 Unified scheduler (NewsData.io, NewsAPI.org, Finlight, Currents)');
    console.log('   ⏰ Smart rotation every 30 minutes');

  } catch (error) {
    console.error('❌ Error initializing Consumer Pulse:', error.message);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Baltar Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for production domains`);
  console.log(`🔗 Health check: ${process.env.NODE_ENV === 'production' ? 'https://baltar-inc-1.onrender.com/health' : `http://localhost:${PORT}/health`}`);

  // Initialize Consumer Pulse with unified system after server starts
  await initializeConsumerPulse();
});
