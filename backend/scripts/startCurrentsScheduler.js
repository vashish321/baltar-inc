#!/usr/bin/env node

/**
 * Currents API Scheduler Starter
 * 
 * This script starts the 2-hour scheduling system for Consumer Pulse
 * - Runs every 2 hours (12 requests per day)
 * - Handles errors gracefully
 * - Provides monitoring and logging
 */

const CurrentsApiService = require('../services/currentsApiService');

class SchedulerManager {
  constructor() {
    this.currentsService = new CurrentsApiService();
    this.isRunning = false;
    this.startTime = null;
    this.requestCount = 0;
    this.lastFetchTime = null;
    this.errors = [];
  }

  /**
   * Start the scheduler with monitoring
   */
  async start() {
    console.log('🚀 Consumer Pulse - Currents API Scheduler');
    console.log('==========================================\n');

    if (this.isRunning) {
      console.log('⚠️  Scheduler is already running!');
      return;
    }

    this.isRunning = true;
    this.startTime = new Date();
    
    console.log(`✅ Scheduler started at: ${this.startTime.toISOString()}`);
    console.log('📅 Schedule: Every 2 hours (12 requests per day)');
    console.log('🎯 Target: Top stories from Currents API\n');

    // Set up graceful shutdown
    this.setupGracefulShutdown();

    // Start the service scheduler
    this.currentsService.startScheduler();

    // Set up monitoring
    this.startMonitoring();

    console.log('🔄 Scheduler is now running...');
    console.log('💡 Press Ctrl+C to stop gracefully\n');
  }

  /**
   * Set up monitoring and status reporting
   */
  startMonitoring() {
    // Status report every hour
    setInterval(() => {
      this.printStatus();
    }, 60 * 60 * 1000); // 1 hour

    // Daily cleanup at midnight
    setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() < 5) {
        console.log('\n🧹 Running daily cleanup...');
        await this.currentsService.cleanupOldArticles();
        this.resetDailyStats();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  /**
   * Print current status
   */
  async printStatus() {
    const now = new Date();
    const uptime = Math.floor((now - this.startTime) / 1000 / 60); // minutes
    const articleCount = await this.currentsService.getArticleCount();

    console.log('\n📊 Scheduler Status Report');
    console.log('==========================');
    console.log(`⏰ Current time: ${now.toISOString()}`);
    console.log(`🕐 Uptime: ${uptime} minutes`);
    console.log(`📰 Total articles in DB: ${articleCount}`);
    console.log(`🔄 Requests today: ${this.requestCount}/12`);
    
    if (this.lastFetchTime) {
      const timeSinceLastFetch = Math.floor((now - this.lastFetchTime) / 1000 / 60);
      console.log(`⏱️  Last fetch: ${timeSinceLastFetch} minutes ago`);
    }

    if (this.errors.length > 0) {
      console.log(`❌ Recent errors: ${this.errors.length}`);
      // Show last 3 errors
      this.errors.slice(-3).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.message} (${error.time})`);
      });
    }

    // Next fetch time
    const nextFetch = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    console.log(`⏭️  Next fetch: ${nextFetch.toISOString()}`);
    console.log('==========================\n');
  }

  /**
   * Reset daily statistics
   */
  resetDailyStats() {
    this.requestCount = 0;
    this.errors = [];
    console.log('📊 Daily statistics reset');
  }

  /**
   * Set up graceful shutdown handlers
   */
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      
      // Stop the scheduler
      this.currentsService.stopScheduler();
      
      // Print final status
      await this.printFinalStatus();
      
      // Disconnect from database
      await this.currentsService.prisma.$disconnect();
      
      console.log('✅ Shutdown complete. Goodbye!');
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  /**
   * Print final status before shutdown
   */
  async printFinalStatus() {
    const now = new Date();
    const totalUptime = Math.floor((now - this.startTime) / 1000 / 60);
    const articleCount = await this.currentsService.getArticleCount();

    console.log('\n📊 Final Status Report');
    console.log('======================');
    console.log(`⏰ Shutdown time: ${now.toISOString()}`);
    console.log(`🕐 Total uptime: ${totalUptime} minutes`);
    console.log(`📰 Articles in database: ${articleCount}`);
    console.log(`🔄 Total requests: ${this.requestCount}`);
    console.log(`❌ Total errors: ${this.errors.length}`);
    console.log('======================\n');
  }

  /**
   * Handle errors from the service
   */
  handleError(error) {
    const errorInfo = {
      message: error.message,
      time: new Date().toISOString()
    };
    
    this.errors.push(errorInfo);
    
    // Keep only last 10 errors
    if (this.errors.length > 10) {
      this.errors = this.errors.slice(-10);
    }

    console.error(`❌ Scheduler error: ${error.message}`);
  }
}

// Create and start the scheduler
const scheduler = new SchedulerManager();

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  scheduler.handleError(error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  scheduler.handleError(new Error(reason));
});

// Start the scheduler
scheduler.start().catch(error => {
  console.error('💥 Failed to start scheduler:', error.message);
  process.exit(1);
});
