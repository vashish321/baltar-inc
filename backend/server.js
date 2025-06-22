const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Baltar Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for production domains`);
  console.log(`🔗 Health check: ${process.env.NODE_ENV === 'production' ? 'https://baltar-inc-production.up.railway.app/health' : `http://localhost:${PORT}/health`}`);
});
