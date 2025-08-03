/**
 * Finlight API Service for Consumer Pulse
 * 
 * Handles fetching and processing financial news articles from Finlight API
 * Features:
 * - 5000 requests per month limit
 * - Financial and crypto news focus
 * - Enhanced duplicate detection
 * - Rate limiting compliance
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const AIService = require('./aiService');
const CategoryDetector = require('../utils/categoryDetector');

class FinlightApiService {
  constructor() {
    this.prisma = new PrismaClient();
    this.aiService = new AIService();
    this.categoryDetector = new CategoryDetector();
    this.apiKey = process.env.FINLIGHT_API_KEY;
    this.baseUrl = 'https://api.finlight.com/v1';
    this.defaultImage = '/consumer-pulse-banner.svg';
    this.monthlyRequestCount = 0;
    this.dailyRequestCount = 0;
    this.lastResetDate = new Date().toDateString();
    this.lastMonthReset = new Date().getMonth();
  }

  /**
   * Check and reset counters if needed
   */
  resetCountersIfNeeded() {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    
    // Reset daily counter
    if (this.lastResetDate !== today) {
      this.dailyRequestCount = 0;
      this.lastResetDate = today;
      console.log('📅 Finlight API daily counter reset');
    }
    
    // Reset monthly counter
    if (this.lastMonthReset !== currentMonth) {
      this.monthlyRequestCount = 0;
      this.lastMonthReset = currentMonth;
      console.log('📅 Finlight API monthly counter reset');
    }
  }

  /**
   * Check if we can make a request (rate limiting)
   */
  canMakeRequest() {
    this.resetCountersIfNeeded();
    return this.monthlyRequestCount < 5000 && this.dailyRequestCount < 166; // 5000/month, ~166/day
  }

  /**
   * Increment request counters
   */
  incrementRequestCount() {
    this.monthlyRequestCount++;
    this.dailyRequestCount++;
    console.log(`📊 Finlight API requests - Today: ${this.dailyRequestCount}/166, Month: ${this.monthlyRequestCount}/5000`);
  }

  /**
   * Fetch articles from Finlight API
   */
  async fetchArticles(options = {}) {
    try {
      if (!this.canMakeRequest()) {
        throw new Error('Rate limit exceeded for Finlight API (5000/month, 166/day)');
      }

      console.log('🔄 Fetching financial news from Finlight API...');

      const params = {
        limit: 30,
        ...options
      };

      const response = await axios.get(`${this.baseUrl}/articles`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params,
        timeout: 15000
      });

      this.incrementRequestCount();

      if (!response.data || !Array.isArray(response.data.articles)) {
        throw new Error('Invalid response format from Finlight API');
      }

      const articles = response.data.articles || [];
      console.log(`📰 Fetched ${articles.length} financial articles from Finlight API`);

      return articles;
    } catch (error) {
      console.error('❌ Error fetching from Finlight API:', error.message);
      throw error;
    }
  }

  /**
   * Fetch crypto-specific news
   */
  async fetchCryptoNews(options = {}) {
    try {
      const cryptoOptions = {
        ...options,
        category: 'crypto',
        tags: 'bitcoin,ethereum,cryptocurrency,blockchain'
      };
      
      return await this.fetchArticles(cryptoOptions);
    } catch (error) {
      console.error('❌ Error fetching crypto news from Finlight API:', error.message);
      throw error;
    }
  }

  /**
   * Fetch market news
   */
  async fetchMarketNews(options = {}) {
    try {
      const marketOptions = {
        ...options,
        category: 'markets',
        tags: 'stocks,trading,market,finance'
      };
      
      return await this.fetchArticles(marketOptions);
    } catch (error) {
      console.error('❌ Error fetching market news from Finlight API:', error.message);
      throw error;
    }
  }

  /**
   * Transform Finlight article to our format
   */
  transformArticle(article) {
    return {
      title: article.title || 'Untitled',
      content: article.content || article.summary || article.description || '',
      summary: article.summary || article.description || '',
      author: article.author || article.source || 'Finlight',
      sourceUrl: article.url || article.link || '',
      imageUrl: article.image || article.imageUrl || this.defaultImage,
      category: this.categoryDetector.determineCategory(article),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : 
                   article.date ? new Date(article.date) : new Date(),
      source: 'Finlight API'
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

        // Get AI sentiment analysis
        try {
          const sentiment = await this.aiService.analyzeSentiment(transformedArticle.content);
          transformedArticle.sentiment = sentiment.sentiment;
          transformedArticle.sentimentScore = sentiment.score;
        } catch (sentimentError) {
          console.warn('Sentiment analysis failed:', sentimentError.message);
          transformedArticle.sentiment = 'NEUTRAL';
          transformedArticle.sentimentScore = 0;
        }

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
        console.log(`✅ Saved financial article: ${transformedArticle.title.substring(0, 50)}...`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing article: ${error.message}`);
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
   * Fetch and process financial news
   */
  async fetchAndProcessFinancialNews(type = 'general') {
    try {
      let articles;
      
      switch (type) {
        case 'crypto':
          articles = await this.fetchCryptoNews();
          break;
        case 'markets':
          articles = await this.fetchMarketNews();
          break;
        default:
          articles = await this.fetchArticles();
      }

      const result = await this.processAndSaveArticles(articles);

      console.log(`📊 Finlight API processing complete:`, result);
      return {
        success: true,
        provider: 'Finlight API',
        type,
        ...result
      };
    } catch (error) {
      console.error('❌ Error in fetchAndProcessFinancialNews:', error.message);
      return {
        success: false,
        provider: 'Finlight API',
        type,
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
    this.resetCountersIfNeeded();
    return {
      provider: 'Finlight API',
      monthlyRequestCount: this.monthlyRequestCount,
      monthlyLimit: 5000,
      dailyRequestCount: this.dailyRequestCount,
      dailyLimit: 166,
      remainingMonthly: 5000 - this.monthlyRequestCount,
      remainingDaily: 166 - this.dailyRequestCount,
      canMakeRequest: this.canMakeRequest(),
      lastResetDate: this.lastResetDate
    };
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const result = await this.fetchArticles({ limit: 3 });
      return {
        success: true,
        message: 'Finlight API connection successful',
        sampleCount: result.length,
        status: this.getStatus()
      };
    } catch (error) {
      return {
        success: false,
        message: `Finlight API connection failed: ${error.message}`,
        status: this.getStatus()
      };
    }
  }
}

module.exports = FinlightApiService;
