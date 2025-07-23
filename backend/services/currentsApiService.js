/**
 * Currents API Service for Consumer Pulse
 * 
 * Handles fetching and processing news articles from Currents API
 * Features:
 * - 2-hour scheduling (12 requests per day)
 * - Enhanced duplicate detection
 * - Custom fallback images
 * - Top stories focus
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const AIService = require('./aiService');

class CurrentsApiService {
  constructor() {
    this.prisma = new PrismaClient();
    this.aiService = new AIService();
    this.apiKey = 'cC58gtz11939xJr6zscGWn3hTUrb5ZV8McYZHRQjfXjlKa1k';
    this.baseUrl = 'https://api.currentsapi.services/v1';
    this.defaultImage = '/consumer-pulse-banner.svg'; // Custom Consumer Pulse banner
    this.schedulerInterval = null;
  }

  /**
   * Transform Currents API article to our database format
   */
  transformArticle(article) {
    try {
      // Use description as content if available
      let content = article.title;
      if (article.description && article.description !== article.title) {
        content = `${article.title}\n\n${article.description}`;
      }

      // Add source context
      if (article.url) {
        content += `\n\nSource: ${article.url}`;
      }

      // Handle image URL - use custom banner if no image
      const imageUrl = (article.image && article.image !== 'None' && article.image !== null) 
        ? article.image 
        : this.defaultImage;

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
        scrapedAt: new Date()
      };
    } catch (error) {
      console.error('❌ Error transforming article:', error.message);
      return null;
    }
  }

  /**
   * Categorize article based on title and category
   */
  categorizeArticle(title, categories) {
    const titleLower = title?.toLowerCase() || '';
    const categoryArray = Array.isArray(categories) ? categories : [categories].filter(Boolean);

    // Map Currents API categories to our categories
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
      'national': 'POLITICS'
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

    return 'GENERAL';
  }

  /**
   * Fetch latest news from Currents API
   */
  async fetchLatestNews(options = {}) {
    try {
      console.log('🔄 Fetching latest news from Currents API...');

      const params = {
        language: 'en',
        page_size: 20,
        ...options
      };

      // Use search endpoint as it's more reliable
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          'Authorization': this.apiKey
        },
        params,
        timeout: 15000 // Reduced timeout
      });

      if (response.data.status !== 'ok') {
        throw new Error(`API Error: ${response.data.message || 'Unknown error'}`);
      }

      const articles = response.data.news || [];
      console.log(`📰 Fetched ${articles.length} articles from Currents API`);

      return articles;
    } catch (error) {
      console.error('❌ Error fetching from Currents API:', error.message);

      // If timeout, try with even smaller request
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.log('⏰ Timeout occurred, trying with smaller request...');
        try {
          const fallbackParams = {
            language: 'en',
            page_size: 10
          };

          const fallbackResponse = await axios.get(`${this.baseUrl}/search`, {
            headers: {
              'Authorization': this.apiKey
            },
            params: fallbackParams,
            timeout: 10000
          });

          if (fallbackResponse.data.status === 'ok') {
            const fallbackArticles = fallbackResponse.data.news || [];
            console.log(`📰 Fallback: Fetched ${fallbackArticles.length} articles`);
            return fallbackArticles;
          }
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError.message);
        }
      }

      throw error;
    }
  }

  /**
   * Enhanced duplicate detection for Currents API
   */
  async isDuplicate(article) {
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

      // 3. Check for title substring matches (handles slight variations)
      const titleWords = article.title.toLowerCase().split(' ').filter(word => word.length > 3);
      if (titleWords.length >= 3) {
        const substringMatches = await this.prisma.newsArticle.findMany({
          where: {
            OR: titleWords.slice(0, 3).map(word => ({
              title: {
                contains: word,
                mode: 'insensitive'
              }
            }))
          },
          select: {
            id: true,
            title: true,
            summary: true,
            createdAt: true
          }
        });

        for (const match of substringMatches) {
          const titleSimilarity = this.calculateStringSimilarity(article.title, match.title);
          if (titleSimilarity > 0.85) {
            console.log(`🔍 Found substring title duplicate: "${match.title}" (${Math.round(titleSimilarity * 100)}% similar)`);
            return true;
          }
        }
      }

      // 4. Check for similar content in recent articles (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const recentArticles = await this.prisma.newsArticle.findMany({
        where: {
          createdAt: {
            gte: oneDayAgo
          }
        },
        select: {
          id: true,
          title: true,
          summary: true
        }
      });

      // Advanced similarity check
      const articleTitleWords = this.extractKeyWords(article.title);
      const articleSummaryWords = this.extractKeyWords(article.summary || '');

      for (const existing of recentArticles) {
        const existingTitleWords = this.extractKeyWords(existing.title);
        const existingSummaryWords = this.extractKeyWords(existing.summary || '');

        const titleSimilarity = this.calculateSimilarity(articleTitleWords, existingTitleWords);
        const summarySimilarity = this.calculateSimilarity(articleSummaryWords, existingSummaryWords);

        // Enhanced thresholds for better duplicate detection
        if (titleSimilarity > 0.75 || summarySimilarity > 0.8) {
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
   * Calculate string similarity using Levenshtein distance
   */
  calculateStringSimilarity(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    if (s1 === s2) return 1;

    const len1 = s1.length;
    const len2 = s2.length;

    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;

    const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,     // deletion
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len2][len1]) / maxLen;
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

    for (const rawArticle of articles) {
      try {
        // Transform article
        const transformedArticle = this.transformArticle(rawArticle);
        if (!transformedArticle) {
          errorCount++;
          continue;
        }

        // Check for duplicates
        const isDupe = await this.isDuplicate(transformedArticle);
        if (isDupe) {
          duplicateCount++;
          continue;
        }

        // AI sentiment analysis
        const sentimentResult = await this.aiService.analyzeSentiment(
          `${transformedArticle.title} ${transformedArticle.summary}`
        );

        // Save to database
        const savedArticle = await this.prisma.newsArticle.create({
          data: {
            ...transformedArticle,
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
      console.log('🚀 Starting Currents API top stories fetch...');

      // Fetch latest news (30 articles by default)
      const articles = await this.fetchLatestNews();

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
        message: `Processed ${articles.length} articles, saved ${result.savedCount}`
      };

    } catch (error) {
      console.error('❌ Error in fetchAndProcessTopStories:', error.message);
      return { success: false, message: error.message };
    } finally {
      // Don't disconnect here as we might have scheduled calls
    }
  }

  /**
   * Start 2-hour scheduling (12 requests per day)
   */
  startScheduler() {
    console.log('⏰ Starting Currents API scheduler...');
    console.log('📅 Schedule: Every 2 hours (12 requests per day)');

    // Run immediately on start
    this.fetchAndProcessTopStories();

    // Schedule every 2 hours (2 * 60 * 60 * 1000 = 7,200,000 ms)
    this.schedulerInterval = setInterval(() => {
      console.log(`\n⏰ Scheduled fetch triggered at ${new Date().toISOString()}`);
      this.fetchAndProcessTopStories();
    }, 2 * 60 * 60 * 1000);

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
   * Cleanup old articles (keep only last 7 days)
   */
  async cleanupOldArticles() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const deleted = await this.prisma.newsArticle.deleteMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo
          }
        }
      });

      if (deleted.count > 0) {
        console.log(`🧹 Cleaned up ${deleted.count} old articles (older than 7 days)`);
      }

      return deleted.count;
    } catch (error) {
      console.error('❌ Error cleaning up old articles:', error.message);
      return 0;
    }
  }
}

module.exports = CurrentsApiService;
