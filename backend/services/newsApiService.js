/**
 * NewsAPI.org Service for Consumer Pulse
 * 
 * Handles fetching and processing news articles from NewsAPI.org
 * Features:
 * - 1000 requests per day limit
 * - Multiple endpoints (top-headlines, everything)
 * - Category-based fetching
 * - Enhanced duplicate detection
 * - Rate limiting compliance
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const AIService = require('./aiService');
const CategoryDetector = require('../utils/categoryDetector');

class NewsApiService {
  constructor() {
    this.prisma = new PrismaClient();
    this.aiService = new AIService();
    this.categoryDetector = new CategoryDetector();
    this.apiKey = process.env.NEWSAPI_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
    this.defaultImage = '/consumer-pulse-banner.svg';
    this.dailyRequestCount = 0;
    this.lastResetDate = new Date().toDateString();
  }

  /**
   * Check and reset daily counter if needed
   */
  resetDailyCounterIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailyRequestCount = 0;
      this.lastResetDate = today;
      console.log('📅 NewsAPI.org daily counter reset');
    }
  }

  /**
   * Check if we can make a request (rate limiting)
   */
  canMakeRequest() {
    this.resetDailyCounterIfNeeded();
    return this.dailyRequestCount < 1000; // 1000 requests per day
  }

  /**
   * Increment request counter
   */
  incrementRequestCount() {
    this.dailyRequestCount++;
    console.log(`📊 NewsAPI.org requests today: ${this.dailyRequestCount}/1000`);
  }

  /**
   * Fetch top headlines from NewsAPI.org
   */
  async fetchTopHeadlines(options = {}) {
    try {
      if (!this.canMakeRequest()) {
        throw new Error('Daily rate limit exceeded for NewsAPI.org (1000 requests)');
      }

      console.log('🔄 Fetching top headlines from NewsAPI.org...');

      const params = {
        apiKey: this.apiKey,
        language: 'en',
        pageSize: 30,
        ...options
      };

      // Add country or category if specified
      if (options.country) params.country = options.country;
      if (options.category) params.category = options.category;
      if (options.sources) params.sources = options.sources;

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params,
        timeout: 15000
      });

      this.incrementRequestCount();

      if (response.data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${response.data.message || 'Unknown error'}`);
      }

      const articles = response.data.articles || [];
      console.log(`📰 Fetched ${articles.length} headlines from NewsAPI.org`);

      return articles;
    } catch (error) {
      console.error('❌ Error fetching from NewsAPI.org:', error.message);
      throw error;
    }
  }

  /**
   * Fetch everything (all articles) from NewsAPI.org
   */
  async fetchEverything(options = {}) {
    try {
      if (!this.canMakeRequest()) {
        throw new Error('Daily rate limit exceeded for NewsAPI.org (1000 requests)');
      }

      console.log('🔄 Fetching everything from NewsAPI.org...');

      const params = {
        apiKey: this.apiKey,
        language: 'en',
        pageSize: 30,
        sortBy: 'publishedAt',
        ...options
      };

      // Add query parameters
      if (options.q) params.q = options.q;
      if (options.domains) params.domains = options.domains;
      if (options.from) params.from = options.from;
      if (options.to) params.to = options.to;

      const response = await axios.get(`${this.baseUrl}/everything`, {
        params,
        timeout: 15000
      });

      this.incrementRequestCount();

      if (response.data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${response.data.message || 'Unknown error'}`);
      }

      const articles = response.data.articles || [];
      console.log(`📰 Fetched ${articles.length} articles from NewsAPI.org`);

      return articles;
    } catch (error) {
      console.error('❌ Error fetching from NewsAPI.org:', error.message);
      throw error;
    }
  }

  /**
   * Transform NewsAPI.org article to our format
   */
  transformArticle(article) {
    return {
      title: article.title || 'Untitled',
      content: article.content || article.description || '',
      summary: article.description || '',
      author: article.author || article.source?.name || 'Unknown',
      sourceUrl: article.url || '',
      imageUrl: article.urlToImage || this.defaultImage,
      category: this.categoryDetector.determineCategory(article),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date()
    };
  }



  /**
   * Check if article already exists in database
   */
  async isDuplicate(article) {
    try {
      const existing = await this.prisma.newsArticle.findFirst({
        where: {
          OR: [
            { title: article.title },
            { sourceUrl: article.sourceUrl }
          ]
        }
      });
      return !!existing;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  }

  /**
   * Process and save articles to database
   */
  async processAndSaveArticles(articles) {
    let savedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        const transformedArticle = this.transformArticle(article);
        
        // Skip if duplicate
        if (await this.isDuplicate(transformedArticle)) {
          duplicateCount++;
          continue;
        }

        // Skip AI sentiment analysis for now to debug
        transformedArticle.sentiment = 'NEUTRAL';
        transformedArticle.sentimentScore = 0;

        // Save to database
        await this.prisma.newsArticle.create({
          data: {
            ...transformedArticle,
            status: 'PUBLISHED',
            keywords: JSON.stringify([]),
            scrapedAt: new Date()
          }
        });

        savedCount++;
        console.log(`✅ Saved article: ${transformedArticle.title.substring(0, 50)}...`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing article: ${error.message}`);
        console.error(`❌ Article data:`, JSON.stringify(article, null, 2));
        console.error(`❌ Stack trace:`, error.stack);
      }
    }

    return {
      savedCount,
      duplicateCount,
      errorCount,
      totalProcessed: articles.length
    };
  }

  /**
   * Fetch and process top stories
   */
  async fetchAndProcessTopStories(category = null) {
    try {
      const options = {};
      if (category) options.category = category;

      const articles = await this.fetchTopHeadlines(options);
      const result = await this.processAndSaveArticles(articles);

      console.log(`📊 NewsAPI.org processing complete:`, result);
      return {
        success: true,
        provider: 'NewsAPI.org',
        ...result
      };
    } catch (error) {
      console.error('❌ Error in fetchAndProcessTopStories:', error.message);
      return {
        success: false,
        provider: 'NewsAPI.org',
        error: error.message,
        savedCount: 0,
        duplicateCount: 0,
        errorCount: 0
      };
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    this.resetDailyCounterIfNeeded();
    return {
      provider: 'NewsAPI.org',
      dailyRequestCount: this.dailyRequestCount,
      dailyLimit: 1000,
      remainingRequests: 1000 - this.dailyRequestCount,
      canMakeRequest: this.canMakeRequest(),
      lastResetDate: this.lastResetDate
    };
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const result = await this.fetchTopHeadlines({ pageSize: 3 });
      return {
        success: true,
        message: 'NewsAPI.org connection successful',
        sampleCount: result.length,
        status: this.getStatus()
      };
    } catch (error) {
      return {
        success: false,
        message: `NewsAPI.org connection failed: ${error.message}`,
        status: this.getStatus()
      };
    }
  }
}

module.exports = NewsApiService;
