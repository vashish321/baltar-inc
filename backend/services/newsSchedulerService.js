const NewsDataService = require('./newsDataService');
const cron = require('node-cron');

class NewsSchedulerService {
  constructor() {
    this.newsDataService = new NewsDataService();
    this.isRunning = false;
    this.dailyCallCount = 0;
    this.lastResetDate = new Date().toDateString();
    this.scheduledTask = null;
  }

  /**
   * Start the automated news fetching scheduler
   * Makes exactly 24 API calls per day (every hour)
   */
  startScheduler() {
    if (this.isRunning) {
      console.log('News scheduler is already running');
      return;
    }

    console.log('🚀 Starting NewsData.io scheduler - 24 hits per day (every hour)');
    
    // Reset daily counter if it's a new day
    this.resetDailyCounterIfNeeded();
    
    // Schedule to run every hour at minute 0
    // This ensures exactly 24 calls per day: 00:00, 01:00, 02:00, etc.
    this.scheduledTask = cron.schedule('0 * * * *', async () => {
      await this.executeScheduledFetch();
    }, {
      scheduled: true,
      timezone: "America/New_York" // Adjust timezone as needed
    });

    this.isRunning = true;
    
    // Run initial fetch immediately
    this.executeScheduledFetch();
    
    console.log('✅ News scheduler started successfully');
  }

  /**
   * Stop the automated scheduler
   */
  stopScheduler() {
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      this.scheduledTask = null;
    }
    this.isRunning = false;
    console.log('🛑 News scheduler stopped');
  }

  /**
   * Execute a scheduled news fetch
   */
  async executeScheduledFetch() {
    try {
      // Reset counter if it's a new day
      this.resetDailyCounterIfNeeded();
      
      // Check if we've already made 24 calls today
      if (this.dailyCallCount >= 24) {
        console.log(`⏸️ Daily API limit reached (${this.dailyCallCount}/24). Skipping fetch.`);
        return;
      }

      const currentHour = new Date().getHours();
      console.log(`⏰ Executing scheduled news fetch #${this.dailyCallCount + 1}/24 at hour ${currentHour}`);
      
      // Use diversified fetching to get different categories throughout the day
      const result = await this.newsDataService.fetchDiversifiedNews();
      
      if (result.success) {
        this.dailyCallCount++;
        console.log(`✅ Scheduled fetch completed. Fetched: ${result.fetched}, Saved: ${result.saved} (Call ${this.dailyCallCount}/24)`);
      } else {
        console.error(`❌ Scheduled fetch failed: ${result.message}`);
      }
      
    } catch (error) {
      console.error('❌ Error in scheduled news fetch:', error.message);
    }
  }

  /**
   * Reset daily counter if it's a new day
   */
  resetDailyCounterIfNeeded() {
    const currentDate = new Date().toDateString();
    if (currentDate !== this.lastResetDate) {
      console.log(`📅 New day detected. Resetting daily counter from ${this.dailyCallCount} to 0`);
      this.dailyCallCount = 0;
      this.lastResetDate = currentDate;
    }
  }

  /**
   * Get current scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      dailyCallCount: this.dailyCallCount,
      remainingCalls: Math.max(0, 24 - this.dailyCallCount),
      lastResetDate: this.lastResetDate,
      nextScheduledTime: this.getNextScheduledTime()
    };
  }

  /**
   * Get the next scheduled execution time
   */
  getNextScheduledTime() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    return nextHour;
  }

  /**
   * Manual fetch (doesn't count towards daily limit)
   */
  async manualFetch(options = {}) {
    console.log('🔧 Executing manual news fetch (not counted in daily limit)');
    try {
      const result = await this.newsDataService.fetchAndProcessNews({
        size: 15,
        ...options
      });
      
      console.log(`✅ Manual fetch completed. Fetched: ${result.fetched}, Saved: ${result.saved}`);
      return result;
    } catch (error) {
      console.error('❌ Error in manual fetch:', error.message);
      throw error;
    }
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const result = await this.newsDataService.fetchBreakingNews({ size: 3 });
      return {
        success: true,
        message: 'NewsData.io API connection successful',
        sampleCount: result.articles.length
      };
    } catch (error) {
      return {
        success: false,
        message: `API connection failed: ${error.message}`
      };
    }
  }
}

// Create singleton instance
const newsScheduler = new NewsSchedulerService();

module.exports = newsScheduler;
