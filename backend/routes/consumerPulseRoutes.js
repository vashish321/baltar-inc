const express = require('express');
const router = express.Router();
const ConsumerPulseService = require('../services/consumerPulseService');
const unifiedNewsScheduler = require('../services/unifiedNewsScheduler');
const AuthService = require('../services/authService');
const NewsDataService = require('../services/newsDataService');
const newsScheduler = require('../services/newsSchedulerService');
const UnifiedNewsService = require('../services/unifiedNewsService');
const { getCurrentProvider, switchProvider } = require('../config/newsApiConfig');

// Middleware to get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Survey Routes
router.post('/surveys', AuthService.requireAuth, async (req, res) => {
  try {
    const surveyData = {
      ...req.body,
      createdBy: req.admin.id
    };

    const result = await ConsumerPulseService.createSurvey(surveyData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ 
      error: 'Failed to create survey',
      details: error.message 
    });
  }
});

router.get('/surveys', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, createdBy } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (createdBy) filters.createdBy = createdBy;

    const result = await ConsumerPulseService.getSurveys(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ 
      error: 'Failed to fetch surveys',
      details: error.message 
    });
  }
});

router.patch('/surveys/:id/status', AuthService.requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await ConsumerPulseService.updateSurveyStatus(id, status);
    res.json(result);
  } catch (error) {
    console.error('Error updating survey status:', error);
    res.status(500).json({ 
      error: 'Failed to update survey status',
      details: error.message 
    });
  }
});

// Survey Response Routes
router.post('/surveys/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
    const responseData = {
      surveyId: id,
      responses: req.body.responses,
      respondentId: req.body.respondentId,
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'],
      location: req.body.location
    };

    const result = await ConsumerPulseService.submitSurveyResponse(responseData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error submitting survey response:', error);
    res.status(500).json({ 
      error: 'Failed to submit survey response',
      details: error.message 
    });
  }
});

// Poll Routes
router.post('/polls', AuthService.requireAuth, async (req, res) => {
  try {
    const pollData = {
      ...req.body,
      createdBy: req.admin.id
    };

    const result = await ConsumerPulseService.createPoll(pollData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ 
      error: 'Failed to create poll',
      details: error.message 
    });
  }
});

router.get('/polls', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filters = {};
    if (status) filters.status = status;

    const result = await ConsumerPulseService.getPolls(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ 
      error: 'Failed to fetch polls',
      details: error.message 
    });
  }
});

router.post('/polls/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const voteData = {
      pollId: id,
      optionIndex: req.body.optionIndex,
      voterId: req.body.voterId,
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent']
    };

    const result = await ConsumerPulseService.submitPollVote(voteData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error submitting poll vote:', error);
    res.status(400).json({ 
      error: 'Failed to submit vote',
      details: error.message 
    });
  }
});

// News Article Routes
router.post('/articles', AuthService.requireAuth, async (req, res) => {
  try {
    const result = await ConsumerPulseService.createArticle(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ 
      error: 'Failed to create article',
      details: error.message 
    });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, sentiment } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (sentiment) filters.sentiment = sentiment;

    const result = await ConsumerPulseService.getArticles(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      details: error.message 
    });
  }
});

// Article Management Routes (Admin only)
router.patch('/articles/:id/status', AuthService.requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await ConsumerPulseService.updateArticleStatus(id, status);
    res.json(result);
  } catch (error) {
    console.error('Error updating article status:', error);
    res.status(500).json({
      error: 'Failed to update article status',
      details: error.message
    });
  }
});

// Sentiment Analytics Routes
router.get('/surveys/:id/sentiment-analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const filters = {
      age: req.query.age,
      gender: req.query.gender,
      location: req.query.location
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const result = await ConsumerPulseService.getSentimentAnalytics(id, filters);
    res.json({ success: true, analytics: result });
  } catch (error) {
    console.error('Error fetching sentiment analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch sentiment analytics',
      details: error.message
    });
  }
});

// API Key Management Routes
router.post('/api-keys', AuthService.requireAuth, async (req, res) => {
  try {
    const result = await ConsumerPulseService.generateAPIKey(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({
      error: 'Failed to generate API key',
      details: error.message
    });
  }
});

// Public API Routes (require API key)
router.use('/api', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const result = await ConsumerPulseService.validateAPIKey(apiKey);
    req.apiKeyRecord = result.keyRecord;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

router.get('/api/surveys', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await ConsumerPulseService.getSurveys(
      parseInt(page),
      parseInt(limit),
      { status: 'ACTIVE' }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch surveys',
      details: error.message 
    });
  }
});

router.get('/api/polls', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await ConsumerPulseService.getPolls(
      parseInt(page),
      parseInt(limit),
      { status: 'ACTIVE' }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch polls',
      details: error.message 
    });
  }
});

router.get('/api/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sentiment } = req.query;
    
    const filters = { status: 'PUBLISHED' };
    if (category) filters.category = category;
    if (sentiment) filters.sentiment = sentiment;

    const result = await ConsumerPulseService.getArticles(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      details: error.message 
    });
  }
});



// NewsData.io integration routes (admin only)
router.post('/fetch-newsdata', AuthService.requireAuth, async (req, res) => {
  try {
    const { country = 'us', language = 'en', category = 'top', query = '', size = 15 } = req.body;

    const result = await newsScheduler.manualFetch({
      country,
      language,
      category,
      query,
      size
    });

    res.json({
      success: true,
      message: 'Manual NewsData.io fetch completed',
      ...result
    });
  } catch (error) {
    console.error('Error in manual NewsData.io fetch:', error);
    res.status(500).json({
      error: 'Failed to fetch news from NewsData.io',
      details: error.message
    });
  }
});

router.post('/start-auto-newsdata', AuthService.requireAuth, async (req, res) => {
  try {
    newsScheduler.startScheduler();

    res.json({
      success: true,
      message: 'Automatic NewsData.io scheduler started (24 hits per day)',
      status: newsScheduler.getStatus()
    });
  } catch (error) {
    console.error('Error starting NewsData.io scheduler:', error);
    res.status(500).json({
      error: 'Failed to start NewsData.io scheduler',
      details: error.message
    });
  }
});

router.post('/stop-auto-newsdata', AuthService.requireAuth, async (req, res) => {
  try {
    newsScheduler.stopScheduler();

    res.json({
      success: true,
      message: 'NewsData.io scheduler stopped',
      status: newsScheduler.getStatus()
    });
  } catch (error) {
    console.error('Error stopping NewsData.io scheduler:', error);
    res.status(500).json({
      error: 'Failed to stop NewsData.io scheduler',
      details: error.message
    });
  }
});

router.get('/newsdata-status', AuthService.requireAuth, async (req, res) => {
  try {
    const status = newsScheduler.getStatus();
    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error getting NewsData.io status:', error);
    res.status(500).json({
      error: 'Failed to get NewsData.io status',
      details: error.message
    });
  }
});

// Test NewsData.io API connection
router.get('/test-newsdata', AuthService.requireAuth, async (req, res) => {
  try {
    const result = await newsScheduler.testConnection();
    res.json(result);
  } catch (error) {
    console.error('Error testing NewsData.io API:', error);
    res.status(500).json({
      error: 'Failed to test NewsData.io API',
      details: error.message
    });
  }
});

// Unified News API Routes (supports both NewsData.io and Currents API)
const unifiedNewsService = new UnifiedNewsService();

// Get current provider info
router.get('/news-provider', AuthService.requireAuth, async (req, res) => {
  try {
    const provider = getCurrentProvider();
    res.json({
      success: true,
      provider: {
        name: provider.name,
        rateLimit: provider.rateLimit
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get provider info',
      details: error.message
    });
  }
});

// Switch news provider
router.post('/switch-provider', AuthService.requireAuth, async (req, res) => {
  try {
    const { provider } = req.body;

    if (!provider || !['newsdata', 'currents'].includes(provider)) {
      return res.status(400).json({
        error: 'Invalid provider. Must be "newsdata" or "currents"'
      });
    }

    switchProvider(provider);
    const newProvider = getCurrentProvider();

    res.json({
      success: true,
      message: `Switched to ${newProvider.name} API`,
      provider: {
        name: newProvider.name,
        rateLimit: newProvider.rateLimit
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to switch provider',
      details: error.message
    });
  }
});

// Manual fetch from current provider
router.post('/fetch-news', AuthService.requireAuth, async (req, res) => {
  try {
    const result = await unifiedNewsService.fetchAndProcessTopStories();

    res.json({
      success: result.success,
      message: result.message,
      provider: result.provider,
      savedCount: result.savedCount,
      duplicateCount: result.duplicateCount,
      errorCount: result.errorCount
    });
  } catch (error) {
    console.error('Error in manual news fetch:', error);
    res.status(500).json({
      error: 'Failed to fetch news',
      details: error.message
    });
  }
});

// Start unified news scheduler
router.post('/start-news-scheduler', AuthService.requireAuth, async (req, res) => {
  try {
    unifiedNewsService.startScheduler();
    const provider = getCurrentProvider();

    res.json({
      success: true,
      message: `News scheduler started with ${provider.name} API`,
      provider: provider.name,
      schedule: 'Every 2 hours (12 requests per day)'
    });
  } catch (error) {
    console.error('Error starting news scheduler:', error);
    res.status(500).json({
      error: 'Failed to start news scheduler',
      details: error.message
    });
  }
});

// Stop unified news scheduler
router.post('/stop-news-scheduler', AuthService.requireAuth, async (req, res) => {
  try {
    unifiedNewsService.stopScheduler();

    res.json({
      success: true,
      message: 'News scheduler stopped'
    });
  } catch (error) {
    console.error('Error stopping news scheduler:', error);
    res.status(500).json({
      error: 'Failed to stop news scheduler',
      details: error.message
    });
  }
});

// Get news statistics
router.get('/news-stats', AuthService.requireAuth, async (req, res) => {
  try {
    const totalArticles = await unifiedNewsService.getArticleCount();
    const provider = getCurrentProvider();

    // Get recent articles count (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentCount = await unifiedNewsService.prisma.newsArticle.count({
      where: {
        createdAt: {
          gte: oneDayAgo
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalArticles,
        recentArticles: recentCount,
        currentProvider: provider.name,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting news stats:', error);
    res.status(500).json({
      error: 'Failed to get news statistics',
      details: error.message
    });
  }
});

// Manual fetch from all news APIs
router.get('/manual-fetch', async (req, res) => {
  try {
    console.log('🔄 Manual fetch triggered via API');
    const result = await unifiedNewsScheduler.manualFetchAll();

    res.json({
      success: true,
      message: 'Manual fetch completed',
      result
    });
  } catch (error) {
    console.error('Error in manual fetch:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute manual fetch',
      message: error.message
    });
  }
});

// Get scheduler status
router.get('/scheduler-status', async (req, res) => {
  try {
    const status = unifiedNewsScheduler.getStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get status'
    });
  }
});

// Test all API connections
router.get('/test-connections', async (req, res) => {
  try {
    const results = await unifiedNewsScheduler.testAllConnections();

    res.json({
      success: true,
      connections: results
    });
  } catch (error) {
    console.error('Error testing connections:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test connections'
    });
  }
});

module.exports = router;
