const express = require('express');
const router = express.Router();
const QuoteService = require('../services/quoteService');
const AuthService = require('../services/authService');

// Get all quotes (admin only)
router.get('/', AuthService.requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, serviceType } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (serviceType) filters.serviceType = serviceType;

    const result = await QuoteService.getAllQuotes(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quotes',
      details: error.message 
    });
  }
});

// Create new quote
router.post('/', async (req, res) => {
  try {
    const quoteData = req.body;

    if (!quoteData.name || !quoteData.email || !quoteData.serviceType) {
      return res.status(400).json({ 
        error: 'Name, email, and service type are required' 
      });
    }

    const quote = await QuoteService.createQuote(quoteData);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      quote
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ 
      error: 'Failed to create quote',
      details: error.message 
    });
  }
});

// Get quote by ID
router.get('/:quoteId', AuthService.requireAuth, async (req, res) => {
  try {
    const { quoteId } = req.params;

    const quote = await QuoteService.getQuoteById(quoteId);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quote',
      details: error.message 
    });
  }
});

// Update quote with pricing (admin only)
router.put('/:quoteId/price', AuthService.requireAuth, async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { quotedAmount, adminNotes } = req.body;

    if (!quotedAmount || quotedAmount <= 0) {
      return res.status(400).json({ 
        error: 'Valid quoted amount is required' 
      });
    }

    const quote = await QuoteService.updateQuotePrice(
      quoteId, 
      quotedAmount, 
      adminNotes,
      req.admin.id
    );

    res.json({
      success: true,
      message: 'Quote updated successfully',
      quote
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ 
      error: 'Failed to update quote',
      details: error.message 
    });
  }
});

// Send quote email (admin only)
router.post('/:quoteId/send', AuthService.requireAuth, async (req, res) => {
  try {
    const { quoteId } = req.params;

    const result = await QuoteService.sendQuoteEmail(quoteId);

    res.json({
      success: true,
      message: 'Quote email sent successfully',
      ...result
    });
  } catch (error) {
    console.error('Error sending quote email:', error);
    res.status(500).json({ 
      error: 'Failed to send quote email',
      details: error.message 
    });
  }
});

// Update quote status (admin only)
router.put('/:quoteId/status', AuthService.requireAuth, async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CONVERTED_TO_PROJECT'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const quote = await QuoteService.updateQuoteStatus(quoteId, status);

    res.json({
      success: true,
      message: 'Quote status updated successfully',
      quote
    });
  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(500).json({ 
      error: 'Failed to update quote status',
      details: error.message 
    });
  }
});

module.exports = router;
