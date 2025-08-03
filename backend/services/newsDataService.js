const axios = require('axios');
const ConsumerPulseService = require('./consumerPulseService');
const AIService = require('./aiService');
const CategoryDetector = require('../utils/categoryDetector');

class NewsDataService {
  constructor() {
    this.apiKey = process.env.NEWSDATA_API_KEY;
    this.baseUrl = 'https://newsdata.io/api/1';
    this.aiService = new AIService();
    this.categoryDetector = new CategoryDetector();
    
    if (!this.apiKey) {
      throw new Error('NewsData.io API key not found in environment variables');
    }
  }

  /**
   * Fetch latest breaking news from NewsData.io
   * @param {Object} options - Query options
   * @returns {Promise<Object>} API response with articles
   */
  async fetchBreakingNews(options = {}) {
    try {
      const {
        country = 'us',
        language = 'en',
        category = 'top',
        query = '',
        size = 20
      } = options;

      const params = {
        apikey: this.apiKey,
        country,
        language,
        category,
        size
      };

      // Add query parameter if provided
      if (query) {
        params.q = query;
      }

      console.log('Fetching news from NewsData.io with params:', params);

      const response = await axios.get(`${this.baseUrl}/news`, {
        params,
        timeout: 30000
      });

      if (response.data.status === 'success') {
        console.log(`Successfully fetched ${response.data.results.length} articles from NewsData.io`);
        return {
          success: true,
          articles: response.data.results,
          totalResults: response.data.totalResults,
          nextPage: response.data.nextPage
        };
      } else {
        throw new Error(`NewsData.io API error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching news from NewsData.io:', error.message);
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }

  /**
   * Transform NewsData.io article to our database format
   * @param {Object} article - Raw article from NewsData.io
   * @returns {Object} Transformed article
   */
  transformArticle(article) {
    try {
      // Generate meaningful content from available data
      let content = article.title;
      
      if (article.description && article.description !== article.title) {
        content = `${article.title}\n\n${article.description}`;
      }

      // Add source context
      if (article.source_name) {
        content += `\n\nSource: ${article.source_name}`;
      }

      // Add keywords if available
      if (article.keywords && article.keywords.length > 0) {
        content += `\n\nKeywords: ${article.keywords.join(', ')}`;
      }

      return {
        title: article.title?.substring(0, 200) || 'Untitled',
        content: content,
        summary: article.description?.substring(0, 300) || article.title?.substring(0, 300) || '',
        sourceUrl: article.link || '',
        source: article.source_name || 'NewsData.io',
        category: this.categoryDetector.determineCategory(article),
        imageUrl: article.image_url || '/Trump.jpg', // Fallback to default image if no image provided
        keywords: article.keywords || [],
        publishedAt: article.pubDate ? new Date(article.pubDate) : new Date(),
        scrapedAt: new Date(),
        status: 'PUBLISHED' // Auto-publish NewsData.io articles since they're from reliable sources
      };
    } catch (error) {
      console.error('Error transforming article:', error.message);
      return null;
    }
  }



  /**
   * Fetch and process news articles, then save to database
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Processing results
   */
  async fetchAndProcessNews(options = {}) {
    try {
      console.log('Starting NewsData.io news fetch and processing...');
      
      // Fetch articles from NewsData.io
      const newsResponse = await this.fetchBreakingNews(options);
      
      if (!newsResponse.success || !newsResponse.articles.length) {
        return {
          success: false,
          message: 'No articles fetched from NewsData.io',
          fetched: 0,
          processed: 0,
          saved: 0
        };
      }

      const fetchedArticles = newsResponse.articles;
      console.log(`Fetched ${fetchedArticles.length} articles from NewsData.io`);

      // Transform articles to our format
      const transformedArticles = [];
      for (const article of fetchedArticles) {
        const transformed = this.transformArticle(article);
        if (transformed) {
          transformedArticles.push(transformed);
        }
      }

      console.log(`Transformed ${transformedArticles.length} articles`);

      // Process articles with AI sentiment analysis
      const processedArticles = [];
      for (const article of transformedArticles) {
        try {
          // Use AI service for sentiment analysis
          const sentimentResult = await this.aiService.analyzeSentiment(
            `${article.title} ${article.summary}`
          );

          const processedArticle = {
            ...article,
            sentiment: sentimentResult.sentiment || 'NEUTRAL',
            sentimentScore: sentimentResult.score || 0,
            status: 'PUBLISHED' // Auto-publish NewsData.io articles
          };

          processedArticles.push(processedArticle);
        } catch (error) {
          console.error('Error processing article with AI:', error.message);
          
          // Fallback without AI processing
          const processedArticle = {
            ...article,
            sentiment: 'NEUTRAL',
            sentimentScore: 0,
            status: 'PUBLISHED'
          };
          
          processedArticles.push(processedArticle);
        }
      }

      console.log(`Processed ${processedArticles.length} articles with sentiment analysis`);

      // Save articles to database
      const savedArticles = [];
      for (const article of processedArticles) {
        try {
          // Check for duplicates using efficient database queries
          const isDuplicate = await this.checkForDuplicate(article);

          if (!isDuplicate) {
            const result = await ConsumerPulseService.createArticle(article);
            if (result.success) {
              savedArticles.push(result.article);
              console.log(`✅ Saved new article: ${article.title}`);
            }
          } else {
            console.log(`⚠️ Skipping duplicate article: ${article.title}`);
          }
        } catch (error) {
          console.error('Error saving article:', error.message);
        }
      }

      console.log(`Saved ${savedArticles.length} new articles to database`);

      return {
        success: true,
        message: 'NewsData.io integration completed successfully',
        fetched: fetchedArticles.length,
        processed: processedArticles.length,
        saved: savedArticles.length,
        articles: savedArticles
      };

    } catch (error) {
      console.error('Error in NewsData.io integration:', error.message);
      return {
        success: false,
        message: `NewsData.io integration failed: ${error.message}`,
        fetched: 0,
        processed: 0,
        saved: 0
      };
    }
  }

  /**
   * Check for duplicate articles in the database
   * @param {Object} article - Article to check for duplicates
   * @returns {Promise<boolean>} True if duplicate exists, false otherwise
   */
  async checkForDuplicate(article) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // 1. Check for exact title match (case-insensitive) or same source URL
      const exactMatch = await prisma.newsArticle.findFirst({
        where: {
          OR: [
            {
              title: {
                equals: article.title,
                mode: 'insensitive'
              }
            },
            ...(article.sourceUrl ? [{
              sourceUrl: article.sourceUrl
            }] : [])
          ]
        },
        select: {
          id: true,
          title: true,
          sourceUrl: true
        }
      });

      if (exactMatch) {
        await prisma.$disconnect();
        return true;
      }

      // 2. Check for similar titles (fuzzy matching)
      // Get articles from the last 7 days to check for similar content
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentArticles = await prisma.newsArticle.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        select: {
          id: true,
          title: true,
          summary: true
        }
      });

      // Check for similar titles using simple similarity algorithm
      const articleTitleWords = this.extractKeyWords(article.title);
      const articleSummaryWords = this.extractKeyWords(article.summary || '');

      for (const existing of recentArticles) {
        const existingTitleWords = this.extractKeyWords(existing.title);
        const existingSummaryWords = this.extractKeyWords(existing.summary || '');

        // Calculate similarity based on common keywords
        const titleSimilarity = this.calculateSimilarity(articleTitleWords, existingTitleWords);
        const summarySimilarity = this.calculateSimilarity(articleSummaryWords, existingSummaryWords);

        // If title similarity > 70% or summary similarity > 80%, consider it a duplicate
        if (titleSimilarity > 0.7 || summarySimilarity > 0.8) {
          console.log(`🔍 Found similar article: "${existing.title}" (Title: ${Math.round(titleSimilarity * 100)}%, Summary: ${Math.round(summarySimilarity * 100)}%)`);
          await prisma.$disconnect();
          return true;
        }
      }

      await prisma.$disconnect();
      return false;
    } catch (error) {
      console.error('Error checking for duplicates:', error.message);
      return false; // If error occurs, allow the article to be saved
    }
  }

  /**
   * Extract meaningful keywords from text
   * @param {string} text - Text to extract keywords from
   * @returns {Array<string>} Array of keywords
   */
  extractKeyWords(text) {
    if (!text) return [];

    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'from', 'up', 'about', 'into', 'over', 'after'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 20); // Limit to first 20 meaningful words
  }

  /**
   * Calculate similarity between two arrays of words
   * @param {Array<string>} words1 - First set of words
   * @param {Array<string>} words2 - Second set of words
   * @returns {number} Similarity score between 0 and 1
   */
  calculateSimilarity(words1, words2) {
    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size; // Jaccard similarity
  }

  /**
   * Start automatic news fetching - exactly 24 hits per day (every hour)
   * This ensures we stay within API limits and get fresh news regularly
   */
  startAutomaticFetching() {
    console.log('Starting automatic NewsData.io fetching - 24 hits per day (every hour)');

    // Initial fetch
    this.fetchAndProcessNews({ size: 10 }); // Smaller size for hourly fetches

    // Set up interval for exactly every hour (24 times per day)
    setInterval(() => {
      console.log('Running scheduled NewsData.io fetch (hourly)...');
      this.fetchAndProcessNews({ size: 10 }); // 10 articles per hour
    }, 60 * 60 * 1000); // Exactly 1 hour = 3600000 ms
  }

  /**
   * Fetch breaking news with different categories throughout the day
   * This helps diversify content across the 24 daily API calls
   */
  async fetchDiversifiedNews() {
    const categories = ['top', 'business', 'technology', 'politics', 'health'];
    const currentHour = new Date().getHours();

    // Rotate categories based on hour of day
    const categoryIndex = currentHour % categories.length;
    const category = categories[categoryIndex];

    console.log(`Fetching ${category} news for hour ${currentHour}`);

    return await this.fetchAndProcessNews({
      category,
      size: 8, // Smaller batches for diversified content
      country: 'us',
      language: 'en'
    });
  }
}

module.exports = NewsDataService;
