/**
 * Unified News Service
 * 
 * Handles both NewsData.io and Currents API with seamless switching
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const AIService = require('./aiService');
const { getCurrentProvider, getSchedulingConfig, getDuplicateDetectionConfig } = require('../config/newsApiConfig');

class UnifiedNewsService {
  constructor() {
    this.prisma = new PrismaClient();
    this.aiService = new AIService();
    this.schedulerInterval = null;
  }

  /**
   * Fetch articles from the current provider
   */
  async fetchArticles(options = {}) {
    const provider = getCurrentProvider();
    console.log(`🔄 Fetching articles from ${provider.name.toUpperCase()} API...`);

    try {
      if (provider.name === 'newsdata') {
        return await this.fetchFromNewsData(provider, options);
      } else if (provider.name === 'currents') {
        return await this.fetchFromCurrents(provider, options);
      } else {
        throw new Error(`Unsupported provider: ${provider.name}`);
      }
    } catch (error) {
      console.error(`❌ Error fetching from ${provider.name}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetch from NewsData.io API
   */
  async fetchFromNewsData(provider, options = {}) {
    const params = {
      apikey: provider.apiKey,
      ...provider.defaultParams,
      ...options
    };

    const response = await axios.get(`${provider.baseUrl}/latest`, {
      params,
      timeout: 15000
    });

    if (response.data.status !== 'success') {
      throw new Error(`NewsData API Error: ${response.data.message || 'Unknown error'}`);
    }

    const articles = response.data.results || [];
    console.log(`📰 Fetched ${articles.length} articles from NewsData.io`);
    
    return articles.map(article => this.transformNewsDataArticle(article));
  }

  /**
   * Fetch from Currents API
   */
  async fetchFromCurrents(provider, options = {}) {
    const params = {
      ...provider.defaultParams,
      ...options
    };

    const response = await axios.get(`${provider.baseUrl}/search`, {
      headers: {
        'Authorization': provider.apiKey
      },
      params,
      timeout: 15000
    });

    if (response.data.status !== 'ok') {
      throw new Error(`Currents API Error: ${response.data.message || 'Unknown error'}`);
    }

    const articles = response.data.news || [];
    console.log(`📰 Fetched ${articles.length} articles from Currents API`);
    
    return articles.map(article => this.transformCurrentsArticle(article));
  }

  /**
   * Transform NewsData.io article to unified format
   */
  transformNewsDataArticle(article) {
    let content = article.title;
    if (article.description && article.description !== article.title) {
      content = `${article.title}\n\n${article.description}`;
    }
    if (article.link) {
      content += `\n\nSource: ${article.link}`;
    }

    const imageUrl = (article.image_url && article.image_url !== 'None') 
      ? article.image_url 
      : '/consumer-pulse-banner.svg';

    return {
      title: article.title?.substring(0, 200) || 'Untitled',
      content: content,
      summary: article.description?.substring(0, 300) || article.title?.substring(0, 300) || '',
      sourceUrl: article.link || '',
      category: this.categorizeArticle(article.title, article.category),
      imageUrl: imageUrl,
      keywords: JSON.stringify(article.keywords || []),
      author: article.creator?.[0] || 'Unknown',
      publishedAt: article.pubDate ? new Date(article.pubDate) : new Date(),
      scrapedAt: new Date(),
      provider: 'NewsData.io'
    };
  }

  /**
   * Transform Currents API article to unified format
   */
  transformCurrentsArticle(article) {
    let content = article.title;
    if (article.description && article.description !== article.title) {
      content = `${article.title}\n\n${article.description}`;
    }
    if (article.url) {
      content += `\n\nSource: ${article.url}`;
    }

    const imageUrl = (article.image && article.image !== 'None' && article.image !== null) 
      ? article.image 
      : '/consumer-pulse-banner.svg';

    return {
      title: article.title?.substring(0, 200) || 'Untitled',
      content: content,
      summary: article.description?.substring(0, 300) || article.title?.substring(0, 300) || '',
      sourceUrl: article.url || '',
      category: this.categorizeArticle(article.title, article.category),
      imageUrl: imageUrl,
      keywords: JSON.stringify(article.category || []),
      author: article.author || 'Unknown',
      publishedAt: article.published ? new Date(article.published) : new Date(),
      scrapedAt: new Date(),
      provider: 'Currents API'
    };
  }

  /**
   * Categorize article based on title and category
   */
  categorizeArticle(title, categories) {
    const titleLower = title?.toLowerCase() || '';
    const categoryArray = Array.isArray(categories) ? categories : [categories].filter(Boolean);

    // Map categories to our system
    const categoryMap = {
      'politics': 'POLITICS',
      'business': 'BUSINESS', 
      'finance': 'BUSINESS',
      'technology': 'TECHNOLOGY',
      'sports': 'SPORTS',
      'entertainment': 'ENTERTAINMENT',
      'health': 'HEALTH',
      'science': 'TECHNOLOGY',
      'world': 'WORLD',
      'national': 'POLITICS',
      'top': 'GENERAL'
    };

    // Check categories first
    for (const cat of categoryArray) {
      const mapped = categoryMap[cat?.toLowerCase()];
      if (mapped) return mapped;
    }

    // Fallback to title-based categorization
    if (titleLower.includes('trump') || titleLower.includes('election') || titleLower.includes('government')) {
      return 'POLITICS';
    }
    if (titleLower.includes('business') || titleLower.includes('market') || titleLower.includes('economy')) {
      return 'BUSINESS';
    }
    if (titleLower.includes('tech') || titleLower.includes('ai') || titleLower.includes('digital')) {
      return 'TECHNOLOGY';
    }
    if (titleLower.includes('sport') || titleLower.includes('game') || titleLower.includes('match')) {
      return 'SPORTS';
    }

    return 'GENERAL';
  }

  /**
   * Enhanced duplicate detection
   */
  async isDuplicate(article) {
    const config = getDuplicateDetectionConfig();
    
    try {
      // 1. Check for exact title match (case-insensitive)
      const exactTitleMatch = await this.prisma.newsArticle.findFirst({
        where: {
          title: {
            equals: article.title,
            mode: 'insensitive'
          }
        }
      });

      if (exactTitleMatch) {
        console.log(`🔍 Found exact title duplicate: "${article.title}"`);
        return true;
      }

      // 2. Check for exact URL match
      if (article.sourceUrl) {
        const exactUrlMatch = await this.prisma.newsArticle.findFirst({
          where: {
            sourceUrl: article.sourceUrl
          }
        });

        if (exactUrlMatch) {
          console.log(`🔍 Found exact URL duplicate: ${article.sourceUrl}`);
          return true;
        }
      }

      // 3. Check for similar content in recent articles
      const checkTime = new Date();
      checkTime.setHours(checkTime.getHours() - config.checkRecentHours);

      const recentArticles = await this.prisma.newsArticle.findMany({
        where: {
          createdAt: {
            gte: checkTime
          }
        },
        select: {
          id: true,
          title: true,
          summary: true
        }
      });

      // Similarity check
      const articleTitleWords = this.extractKeyWords(article.title);
      const articleSummaryWords = this.extractKeyWords(article.summary || '');

      for (const existing of recentArticles) {
        const existingTitleWords = this.extractKeyWords(existing.title);
        const existingSummaryWords = this.extractKeyWords(existing.summary || '');

        const titleSimilarity = this.calculateSimilarity(articleTitleWords, existingTitleWords);
        const summarySimilarity = this.calculateSimilarity(articleSummaryWords, existingSummaryWords);

        if (titleSimilarity > config.titleSimilarityThreshold || 
            summarySimilarity > config.summarySimilarityThreshold) {
          console.log(`🔍 Found similar article: "${existing.title}" (Title: ${Math.round(titleSimilarity * 100)}%, Summary: ${Math.round(summarySimilarity * 100)}%)`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Error checking for duplicates:', error.message);
      return false; // Don't block article if duplicate check fails
    }
  }

  /**
   * Extract key words from text for similarity comparison
   */
  extractKeyWords(text) {
    if (!text) return [];
    
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Calculate similarity between two word arrays
   */
  calculateSimilarity(words1, words2) {
    if (words1.length === 0 && words2.length === 0) return 1;
    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Process and save articles with AI sentiment analysis
   */
  async processAndSaveArticles(articles) {
    console.log(`🔄 Processing ${articles.length} articles...`);

    let savedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        // Check for duplicates
        const isDupe = await this.isDuplicate(article);
        if (isDupe) {
          duplicateCount++;
          continue;
        }

        // AI sentiment analysis
        const sentimentResult = await this.aiService.analyzeSentiment(
          `${article.title} ${article.summary}`
        );

        // Save to database
        const savedArticle = await this.prisma.newsArticle.create({
          data: {
            ...article,
            sentiment: sentimentResult.sentiment || 'NEUTRAL',
            sentimentScore: sentimentResult.score || 0,
            status: 'PUBLISHED'
          }
        });

        savedCount++;
        console.log(`✅ Saved: "${savedArticle.title.substring(0, 50)}..."`);

      } catch (error) {
        console.error(`❌ Error processing article: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Processing Summary:`);
    console.log(`   ✅ Saved: ${savedCount} articles`);
    console.log(`   🔍 Duplicates skipped: ${duplicateCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    return { savedCount, duplicateCount, errorCount };
  }

  /**
   * Fetch and process top stories
   */
  async fetchAndProcessTopStories() {
    try {
      const provider = getCurrentProvider();
      console.log(`🚀 Starting ${provider.name.toUpperCase()} top stories fetch...`);

      // Fetch articles
      const articles = await this.fetchArticles();

      if (articles.length === 0) {
        console.log('⚠️  No articles received from API');
        return { success: false, message: 'No articles received' };
      }

      // Process and save articles
      const result = await this.processAndSaveArticles(articles);

      console.log('🎉 Top stories fetch completed successfully!');
      return {
        success: true,
        ...result,
        provider: provider.name,
        message: `Processed ${articles.length} articles, saved ${result.savedCount}`
      };

    } catch (error) {
      console.error('❌ Error in fetchAndProcessTopStories:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Start 2-hour scheduling
   */
  startScheduler() {
    const config = getSchedulingConfig();
    const provider = getCurrentProvider();

    console.log('⏰ Starting News API scheduler...');
    console.log(`📡 Provider: ${provider.name.toUpperCase()}`);
    console.log(`📅 Schedule: Every ${config.intervalHours} hours (${config.maxRequestsPerDay} requests per day)`);

    // Run immediately on start
    this.fetchAndProcessTopStories();

    // Schedule regular fetches
    this.schedulerInterval = setInterval(() => {
      console.log(`\n⏰ Scheduled fetch triggered at ${new Date().toISOString()}`);
      this.fetchAndProcessTopStories();
    }, config.intervalHours * 60 * 60 * 1000);

    console.log('✅ Scheduler started successfully!');
  }

  /**
   * Stop the scheduler
   */
  stopScheduler() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
      console.log('⏹️  Scheduler stopped');
    }
  }

  /**
   * Get current article count
   */
  async getArticleCount() {
    try {
      return await this.prisma.newsArticle.count();
    } catch (error) {
      console.error('❌ Error getting article count:', error.message);
      return 0;
    }
  }

  /**
   * Cleanup old articles
   */
  async cleanupOldArticles() {
    try {
      const config = getSchedulingConfig();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - config.cleanupDays);

      const deleted = await this.prisma.newsArticle.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      if (deleted.count > 0) {
        console.log(`🧹 Cleaned up ${deleted.count} old articles (older than ${config.cleanupDays} days)`);
      }

      return deleted.count;
    } catch (error) {
      console.error('❌ Error cleaning up old articles:', error.message);
      return 0;
    }
  }
}

module.exports = UnifiedNewsService;
