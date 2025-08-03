/**
 * Unified News Scheduler for Consumer Pulse
 * 
 * Intelligently manages all news APIs with rate limiting and categorization
 * Features:
 * - Smart API rotation based on rate limits
 * - Category-based content fetching
 * - Real-time WebSocket broadcasting
 * - Comprehensive error handling
 */

const cron = require('node-cron');
const NewsDataService = require('./newsDataService');
const NewsApiService = require('./newsApiService');
const FinlightApiService = require('./finlightApiService');
const CurrentsApiService = require('./currentsApiService');
const websocketService = require('./websocketService');
const { config } = require('../config/newsApiConfig');

class UnifiedNewsScheduler {
  constructor() {
    this.services = {
      newsdata: new NewsDataService(),
      newsapi: new NewsApiService(),
      finlight: new FinlightApiService(),
      currents: new CurrentsApiService()
    };
    
    this.isRunning = false;
    this.scheduledTask = null;
    this.currentRotationIndex = 0;
    this.lastFetchTimes = {};
    this.dailyStats = {
      totalFetched: 0,
      byProvider: {},
      byCategory: {},
      errors: []
    };
  }

  /**
   * Start the unified scheduler
   */
  startScheduler() {
    if (this.isRunning) {
      console.log('📅 Unified news scheduler is already running');
      return;
    }

    console.log('🚀 Starting unified news scheduler...');
    
    // Reset daily stats if needed
    this.resetDailyStatsIfNeeded();
    
    // Schedule to run every 30 minutes
    this.scheduledTask = cron.schedule('*/30 * * * *', async () => {
      await this.executeScheduledFetch();
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });

    this.isRunning = true;
    console.log('✅ Unified news scheduler started (every 30 minutes)');
    
    // Broadcast status update
    this.broadcastStatus();
  }

  /**
   * Stop the scheduler
   */
  stopScheduler() {
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      this.scheduledTask = null;
    }
    this.isRunning = false;
    console.log('⏹️ Unified news scheduler stopped');
    this.broadcastStatus();
  }

  /**
   * Execute scheduled fetch with intelligent API rotation
   */
  async executeScheduledFetch() {
    try {
      console.log('🔄 Executing scheduled news fetch...');
      
      const fetchPlan = this.createFetchPlan();
      const results = [];

      for (const task of fetchPlan) {
        try {
          const result = await this.executeFetchTask(task);
          results.push(result);
          
          // Broadcast new articles if any
          if (result.success && result.savedCount > 0) {
            await this.broadcastNewArticles(task.provider, task.category);
          }
          
          // Small delay between API calls
          await this.delay(2000);
          
        } catch (error) {
          console.error(`❌ Error fetching from ${task.provider}:`, error.message);
          this.dailyStats.errors.push({
            provider: task.provider,
            error: error.message,
            timestamp: new Date()
          });
        }
      }

      // Update daily stats
      this.updateDailyStats(results);
      
      // Broadcast status update
      this.broadcastStatus();
      
      console.log('✅ Scheduled fetch completed');
      
    } catch (error) {
      console.error('❌ Error in scheduled fetch:', error.message);
    }
  }

  /**
   * Create intelligent fetch plan based on API limits and priorities
   */
  createFetchPlan() {
    const plan = [];
    const now = new Date();
    const hour = now.getHours();

    // NewsData.io - High priority, spread throughout day
    if (this.canFetchFromProvider('newsdata')) {
      plan.push({
        provider: 'newsdata',
        category: this.getRotatingCategory(['general', 'business', 'technology']),
        priority: 1
      });
    }

    // NewsAPI.org - Medium-high priority, good for general news
    if (this.canFetchFromProvider('newsapi') && hour % 2 === 0) {
      plan.push({
        provider: 'newsapi',
        category: this.getRotatingCategory(['general', 'business', 'technology', 'health']),
        priority: 2
      });
    }

    // Finlight API - Financial focus, during business hours
    if (this.canFetchFromProvider('finlight') && (hour >= 9 && hour <= 17)) {
      const finType = hour % 3 === 0 ? 'crypto' : 'markets';
      plan.push({
        provider: 'finlight',
        category: 'financial',
        type: finType,
        priority: 3
      });
    }

    // Currents API - Backup and sports/entertainment
    if (this.canFetchFromProvider('currents') && hour % 3 === 0) {
      plan.push({
        provider: 'currents',
        category: this.getRotatingCategory(['general', 'sports']),
        priority: 4
      });
    }

    // Sort by priority
    return plan.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if we can fetch from a specific provider
   */
  canFetchFromProvider(provider) {
    const service = this.services[provider];
    if (!service || !service.canMakeRequest) return false;
    
    try {
      return service.canMakeRequest();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get rotating category based on current index
   */
  getRotatingCategory(categories) {
    const category = categories[this.currentRotationIndex % categories.length];
    this.currentRotationIndex++;
    return category;
  }

  /**
   * Execute a specific fetch task
   */
  async executeFetchTask(task) {
    const service = this.services[task.provider];
    
    switch (task.provider) {
      case 'newsdata':
        return await service.fetchAndProcessNews({
          category: task.category,
          size: 15
        });
        
      case 'newsapi':
        return await service.fetchAndProcessTopStories(task.category);
        
      case 'finlight':
        return await service.fetchAndProcessFinancialNews(task.type || 'general');
        
      case 'currents':
        return await service.fetchAndProcessNews({
          category: task.category
        });
        
      default:
        throw new Error(`Unknown provider: ${task.provider}`);
    }
  }

  /**
   * Broadcast new articles via WebSocket
   */
  async broadcastNewArticles(provider, category) {
    try {
      // Get recent articles from this provider
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const recentArticles = await prisma.newsArticle.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      if (recentArticles.length > 0) {
        websocketService.broadcastLiveUpdate(category, recentArticles);
      }
      
    } catch (error) {
      console.error('Error broadcasting new articles:', error.message);
    }
  }

  /**
   * Get provider display name
   */
  getProviderDisplayName(provider) {
    const names = {
      newsdata: 'NewsData.io',
      newsapi: 'NewsAPI.org',
      finlight: 'Finlight API',
      currents: 'Currents API'
    };
    return names[provider] || provider;
  }

  /**
   * Update daily statistics
   */
  updateDailyStats(results) {
    for (const result of results) {
      if (result.success) {
        this.dailyStats.totalFetched += result.savedCount || 0;
        
        if (!this.dailyStats.byProvider[result.provider]) {
          this.dailyStats.byProvider[result.provider] = 0;
        }
        this.dailyStats.byProvider[result.provider] += result.savedCount || 0;
      }
    }
  }

  /**
   * Reset daily stats if needed
   */
  resetDailyStatsIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailyStats = {
        totalFetched: 0,
        byProvider: {},
        byCategory: {},
        errors: []
      };
      this.lastResetDate = today;
      console.log('📊 Daily stats reset');
    }
  }

  /**
   * Broadcast status via WebSocket
   */
  broadcastStatus() {
    const status = this.getStatus();
    websocketService.broadcastApiStatus(status);
  }

  /**
   * Get current status
   */
  getStatus() {
    this.resetDailyStatsIfNeeded();
    
    const providerStatuses = {};
    for (const [name, service] of Object.entries(this.services)) {
      try {
        providerStatuses[name] = service.getStatus ? service.getStatus() : { status: 'unknown' };
      } catch (error) {
        providerStatuses[name] = { status: 'error', error: error.message };
      }
    }

    return {
      isRunning: this.isRunning,
      providers: providerStatuses,
      dailyStats: this.dailyStats,
      lastFetchTimes: this.lastFetchTimes,
      nextFetch: this.isRunning ? 'Every 30 minutes' : 'Stopped'
    };
  }

  /**
   * Manual fetch from all available providers
   */
  async manualFetchAll() {
    try {
      console.log('🔄 Starting manual fetch from all providers...');
      
      const fetchPlan = this.createFetchPlan();
      const results = [];

      for (const task of fetchPlan) {
        try {
          const result = await this.executeFetchTask(task);
          results.push(result);
          
          if (result.success && result.savedCount > 0) {
            await this.broadcastNewArticles(task.provider, task.category);
          }
          
          await this.delay(3000); // Longer delay for manual fetch
          
        } catch (error) {
          console.error(`❌ Error in manual fetch from ${task.provider}:`, error.message);
          results.push({
            success: false,
            provider: task.provider,
            error: error.message
          });
        }
      }

      this.updateDailyStats(results);
      this.broadcastStatus();

      return {
        success: true,
        results,
        totalProviders: fetchPlan.length,
        successfulProviders: results.filter(r => r.success).length
      };
      
    } catch (error) {
      console.error('❌ Error in manual fetch all:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test all API connections
   */
  async testAllConnections() {
    const results = {};
    
    for (const [name, service] of Object.entries(this.services)) {
      try {
        if (service.testConnection) {
          results[name] = await service.testConnection();
        } else {
          results[name] = { success: false, message: 'Test method not available' };
        }
      } catch (error) {
        results[name] = { success: false, message: error.message };
      }
    }
    
    return results;
  }
}

// Create singleton instance
const unifiedNewsScheduler = new UnifiedNewsScheduler();

module.exports = unifiedNewsScheduler;
