const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
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

// Health check
app.get('/', (req, res) => {
  res.send('Baltar Backend is up and running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
