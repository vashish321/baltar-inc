const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const result = await AuthService.loginAdmin(email, password);

    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      error: error.message || 'Login failed' 
    });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const result = await AuthService.verifyToken(token);

    res.json(result);
  } catch (error) {
    res.status(401).json({ 
      error: error.message || 'Token verification failed' 
    });
  }
});

// Create admin (for initial setup only)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    const result = await AuthService.createAdmin(email, password, firstName, lastName);

    res.status(201).json(result);
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create admin' 
    });
  }
});

module.exports = router;
