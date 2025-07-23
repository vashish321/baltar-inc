const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const AIService = require('./aiService');

const prisma = new PrismaClient();
const aiService = new AIService();

class ConsumerPulseService {
  // Survey Management
  static async createSurvey(surveyData) {
    try {
      const survey = await prisma.survey.create({
        data: {
          title: surveyData.title,
          description: surveyData.description,
          targetAudience: surveyData.targetAudience,
          questions: JSON.stringify(surveyData.questions),
          settings: JSON.stringify(surveyData.settings || {}),
          createdBy: surveyData.createdBy,
          startDate: surveyData.startDate ? new Date(surveyData.startDate) : null,
          endDate: surveyData.endDate ? new Date(surveyData.endDate) : null,
          status: surveyData.status || 'DRAFT'
        }
      });

      return { success: true, survey };
    } catch (error) {
      throw new Error(`Failed to create survey: ${error.message}`);
    }
  }

  static async getSurveys(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {};

      if (filters.status) where.status = filters.status;
      if (filters.createdBy) where.createdBy = filters.createdBy;

      const [surveys, total] = await Promise.all([
        prisma.survey.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            responses: {
              select: { id: true }
            },
            analytics: {
              orderBy: { generatedAt: 'desc' },
              take: 1
            }
          }
        }),
        prisma.survey.count({ where })
      ]);

      return {
        surveys: surveys.map(survey => ({
          ...survey,
          questions: JSON.parse(survey.questions),
          settings: JSON.parse(survey.settings || '{}'),
          responseCount: survey.responses.length,
          latestAnalytics: survey.analytics[0] || null
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch surveys: ${error.message}`);
    }
  }

  static async updateSurveyStatus(surveyId, status) {
    try {
      const survey = await prisma.survey.update({
        where: { id: surveyId },
        data: { status }
      });

      return { success: true, survey };
    } catch (error) {
      throw new Error(`Failed to update survey status: ${error.message}`);
    }
  }

  // Survey Response Management with AI Sentiment Analysis
  static async submitSurveyResponse(responseData) {
    try {
      // Perform AI sentiment analysis on open-text responses
      const sentimentAnalysis = await this.analyzeSurveyResponseSentiment(responseData);

      const response = await prisma.surveyResponse.create({
        data: {
          surveyId: responseData.surveyId,
          respondentId: responseData.respondentId || null,
          responses: JSON.stringify(responseData.responses),
          ipAddress: responseData.ipAddress,
          userAgent: responseData.userAgent,
          location: responseData.location,
          // Store AI sentiment analysis results
          sentiment: sentimentAnalysis.overallSentiment,
          sentimentScore: sentimentAnalysis.overallScore,
          sentimentConfidence: sentimentAnalysis.overallConfidence,
          emotions: JSON.stringify(sentimentAnalysis.emotions),
          themes: JSON.stringify(sentimentAnalysis.themes),
          demographics: JSON.stringify(responseData.demographics || {})
        }
      });

      // Update survey analytics with sentiment data
      await this.updateSurveyAnalytics(responseData.surveyId);

      return {
        success: true,
        response,
        sentimentAnalysis: sentimentAnalysis
      };
    } catch (error) {
      throw new Error(`Failed to submit survey response: ${error.message}`);
    }
  }

  // AI-Powered Sentiment Analysis for Survey Responses
  static async analyzeSurveyResponseSentiment(responseData) {
    const AIService = require('./aiService');
    const aiService = new AIService();

    try {
      // Extract all text responses for sentiment analysis
      const textResponses = [];
      const responses = responseData.responses || {};

      Object.values(responses).forEach(response => {
        if (typeof response === 'string' && response.trim().length > 5) {
          textResponses.push(response.trim());
        }
      });

      if (textResponses.length === 0) {
        return {
          overallSentiment: 'NEUTRAL',
          overallScore: 0,
          overallConfidence: 0.5,
          emotions: [],
          themes: [],
          responseAnalysis: []
        };
      }

      // Analyze each text response (optimized for minimal data)
      const responseAnalysis = [];
      let totalScore = 0;
      let totalConfidence = 0;
      const allEmotions = new Set();
      const allThemes = new Set();

      for (const text of textResponses) {
        // Only send essential data to AI
        const shortText = text.length > 50 ? text.substring(0, 50) : text;
        const analysis = await aiService.analyzeSurveyResponseSentiment(
          shortText,
          {} // Skip demographics for now to reduce payload
        );

        responseAnalysis.push({
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          sentiment: analysis.sentiment,
          score: analysis.score,
          confidence: analysis.confidence,
          emotions: analysis.emotions || [],
          themes: analysis.themes || [],
          intensity: analysis.intensity || 'MEDIUM'
        });

        totalScore += analysis.score || 0;
        totalConfidence += analysis.confidence || 0;

        // Collect all emotions and themes
        if (analysis.emotions) {
          analysis.emotions.forEach(emotion => allEmotions.add(emotion));
        }
        if (analysis.themes) {
          analysis.themes.forEach(theme => allThemes.add(theme));
        }
      }

      // Calculate overall sentiment
      const avgScore = totalScore / textResponses.length;
      const avgConfidence = totalConfidence / textResponses.length;

      let overallSentiment = 'NEUTRAL';
      if (avgScore > 0.2) overallSentiment = 'POSITIVE';
      else if (avgScore < -0.2) overallSentiment = 'NEGATIVE';

      return {
        overallSentiment,
        overallScore: Math.round(avgScore * 100) / 100,
        overallConfidence: Math.round(avgConfidence * 100) / 100,
        emotions: Array.from(allEmotions),
        themes: Array.from(allThemes),
        responseAnalysis,
        totalResponses: textResponses.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in survey sentiment analysis:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      // Return neutral sentiment if analysis fails
      return {
        overallSentiment: 'NEUTRAL',
        overallScore: 0,
        overallConfidence: 0.5,
        emotions: [],
        themes: [],
        responseAnalysis: [],
        error: error.message,
        fallbackUsed: true
      };
    }
  }

  // Poll Management
  static async createPoll(pollData) {
    try {
      const poll = await prisma.poll.create({
        data: {
          title: pollData.title,
          question: pollData.question,
          options: JSON.stringify(pollData.options),
          allowMultiple: pollData.allowMultiple || false,
          endDate: pollData.endDate ? new Date(pollData.endDate) : null,
          createdBy: pollData.createdBy,
          status: pollData.status || 'ACTIVE'
        }
      });

      return { success: true, poll };
    } catch (error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    }
  }

  static async getPolls(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {};

      if (filters.status) where.status = filters.status;

      const [polls, total] = await Promise.all([
        prisma.poll.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            votes: {
              select: { optionIndex: true }
            }
          }
        }),
        prisma.poll.count({ where })
      ]);

      return {
        polls: polls.map(poll => {
          const options = JSON.parse(poll.options);
          const voteCounts = options.map((_, index) => 
            poll.votes.filter(vote => vote.optionIndex === index).length
          );
          const totalVotes = poll.votes.length;

          return {
            ...poll,
            options,
            voteCounts,
            totalVotes,
            votes: undefined // Remove detailed votes from response
          };
        }),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch polls: ${error.message}`);
    }
  }

  static async submitPollVote(voteData) {
    try {
      // Check if IP already voted (if not allowing multiple votes)
      const existingVote = await prisma.pollVote.findUnique({
        where: {
          pollId_ipAddress: {
            pollId: voteData.pollId,
            ipAddress: voteData.ipAddress
          }
        }
      });

      if (existingVote) {
        throw new Error('You have already voted in this poll');
      }

      const vote = await prisma.pollVote.create({
        data: {
          pollId: voteData.pollId,
          optionIndex: voteData.optionIndex,
          voterId: voteData.voterId || null,
          ipAddress: voteData.ipAddress,
          userAgent: voteData.userAgent
        }
      });

      return { success: true, vote };
    } catch (error) {
      throw new Error(`Failed to submit vote: ${error.message}`);
    }
  }

  // News Article Management
  static async createArticle(articleData) {
    try {
      const article = await prisma.newsArticle.create({
        data: {
          title: articleData.title,
          content: articleData.content,
          summary: articleData.summary,
          author: articleData.author,
          sourceUrl: articleData.sourceUrl,
          imageUrl: articleData.imageUrl,
          keywords: JSON.stringify(articleData.keywords || []),
          category: articleData.category,
          status: articleData.status || 'DRAFT',
          sentiment: articleData.sentiment,
          sentimentScore: articleData.sentimentScore,
          publishedAt: articleData.status === 'PUBLISHED' ? new Date() : null,
          scrapedAt: articleData.scrapedAt ? new Date(articleData.scrapedAt) : null
        }
      });

      return { success: true, article };
    } catch (error) {
      throw new Error(`Failed to create article: ${error.message}`);
    }
  }

  static async getArticles(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {};

      if (filters.status) where.status = filters.status;
      if (filters.category) where.category = filters.category;
      if (filters.sentiment) where.sentiment = filters.sentiment;

      const [articles, total] = await Promise.all([
        prisma.newsArticle.findMany({
          where,
          skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
          include: {
            analytics: {
              orderBy: { generatedAt: 'desc' },
              take: 1
            }
          }
        }),
        prisma.newsArticle.count({ where })
      ]);

      return {
        articles: articles.map(article => ({
          ...article,
          keywords: JSON.parse(article.keywords),
          latestAnalytics: article.analytics[0] || null
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }
  }

  static async updateArticleStatus(articleId, status) {
    try {
      const article = await prisma.newsArticle.update({
        where: { id: articleId },
        data: {
          status,
          publishedAt: status === 'PUBLISHED' ? new Date() : null
        }
      });

      return { success: true, article };
    } catch (error) {
      throw new Error(`Failed to update article status: ${error.message}`);
    }
  }

  // Analytics Methods
  static async updateSurveyAnalytics(surveyId) {
    try {
      const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        include: {
          responses: true
        }
      });

      if (!survey) {
        throw new Error('Survey not found');
      }

      const totalResponses = survey.responses.length;
      if (totalResponses === 0) return;

      // Generate AI-powered insights
      const insights = await aiService.generateSurveyInsights(survey, survey.responses);

      // Analyze sentiment of text responses
      const textResponses = survey.responses
        .map(r => JSON.parse(r.responses))
        .filter(responses => Object.values(responses).some(val => typeof val === 'string' && val.length > 10))
        .flatMap(responses => Object.values(responses).filter(val => typeof val === 'string' && val.length > 10));

      let averageSentiment = 0;
      if (textResponses.length > 0) {
        const sentiments = await aiService.batchSentimentAnalysis(textResponses);
        averageSentiment = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
      }

      // Calculate completion rate (simplified)
      const completionRate = 100; // All stored responses are complete

      const analytics = await prisma.surveyAnalytics.create({
        data: {
          surveyId,
          totalResponses,
          completionRate,
          sentimentScore: averageSentiment,
          insights: JSON.stringify(insights),
          demographics: JSON.stringify({
            total: totalResponses,
            textResponseCount: textResponses.length
          })
        }
      });

      return { success: true, analytics };
    } catch (error) {
      throw new Error(`Failed to update survey analytics: ${error.message}`);
    }
  }

  // Real-time Sentiment Analytics with Demographic Filtering
  static async getSentimentAnalytics(surveyId, filters = {}) {
    try {
      // Build where clause for demographic filtering
      let whereClause = { surveyId };

      if (filters.age) {
        whereClause.demographics = {
          contains: `"age":"${filters.age}"`
        };
      }

      if (filters.gender) {
        whereClause.demographics = {
          ...whereClause.demographics,
          contains: `"gender":"${filters.gender}"`
        };
      }

      if (filters.location) {
        whereClause.demographics = {
          ...whereClause.demographics,
          contains: `"location":"${filters.location}"`
        };
      }

      // Get all responses with sentiment data
      const responses = await prisma.surveyResponse.findMany({
        where: whereClause,
        select: {
          sentiment: true,
          sentimentScore: true,
          sentimentConfidence: true,
          emotions: true,
          themes: true,
          demographics: true,
          completedAt: true
        }
      });

      // Calculate sentiment metrics
      const totalResponses = responses.length;
      const sentimentCounts = {
        POSITIVE: 0,
        NEGATIVE: 0,
        NEUTRAL: 0
      };

      let totalScore = 0;
      let totalConfidence = 0;
      const emotionCounts = {};
      const themeCounts = {};

      responses.forEach(response => {
        // Count sentiments
        if (response.sentiment) {
          sentimentCounts[response.sentiment]++;
        }

        // Sum scores and confidence
        if (response.sentimentScore !== null) {
          totalScore += response.sentimentScore;
        }
        if (response.sentimentConfidence !== null) {
          totalConfidence += response.sentimentConfidence;
        }

        // Count emotions
        if (response.emotions) {
          try {
            const emotions = JSON.parse(response.emotions);
            emotions.forEach(emotion => {
              emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            });
          } catch (e) {
            console.error('Error parsing emotions:', e);
          }
        }

        // Count themes
        if (response.themes) {
          try {
            const themes = JSON.parse(response.themes);
            themes.forEach(theme => {
              themeCounts[theme] = (themeCounts[theme] || 0) + 1;
            });
          } catch (e) {
            console.error('Error parsing themes:', e);
          }
        }
      });

      // Calculate percentages and averages
      const sentimentPercentages = {
        positive: totalResponses > 0 ? Math.round((sentimentCounts.POSITIVE / totalResponses) * 100) : 0,
        negative: totalResponses > 0 ? Math.round((sentimentCounts.NEGATIVE / totalResponses) * 100) : 0,
        neutral: totalResponses > 0 ? Math.round((sentimentCounts.NEUTRAL / totalResponses) * 100) : 0
      };

      const averageScore = totalResponses > 0 ? Math.round((totalScore / totalResponses) * 100) / 100 : 0;
      const averageConfidence = totalResponses > 0 ? Math.round((totalConfidence / totalResponses) * 100) / 100 : 0;

      // Get top emotions and themes
      const topEmotions = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([emotion, count]) => ({ emotion, count, percentage: Math.round((count / totalResponses) * 100) }));

      const topThemes = Object.entries(themeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([theme, count]) => ({ theme, count, percentage: Math.round((count / totalResponses) * 100) }));

      return {
        totalResponses,
        sentimentCounts,
        sentimentPercentages,
        averageScore,
        averageConfidence,
        topEmotions,
        topThemes,
        appliedFilters: filters,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Failed to fetch sentiment analytics: ${error.message}`);
    }
  }

  // API Key Management
  static async generateAPIKey(keyData) {
    try {
      const apiKey = crypto.randomBytes(32).toString('hex');
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const apiKeyRecord = await prisma.aPIKey.create({
        data: {
          keyHash,
          name: keyData.name,
          clientId: keyData.clientId || null,
          tier: keyData.tier || 'FREE',
          rateLimit: keyData.rateLimit || 100,
          expiresAt: keyData.expiresAt ? new Date(keyData.expiresAt) : null
        }
      });

      return { 
        success: true, 
        apiKey: apiKey, // Return the actual key only once
        keyRecord: apiKeyRecord 
      };
    } catch (error) {
      throw new Error(`Failed to generate API key: ${error.message}`);
    }
  }

  static async validateAPIKey(apiKey) {
    try {
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      const keyRecord = await prisma.aPIKey.findUnique({
        where: { keyHash },
        include: { client: true }
      });

      if (!keyRecord || !keyRecord.isActive) {
        throw new Error('Invalid or inactive API key');
      }

      if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
        throw new Error('API key has expired');
      }

      // Update last used timestamp
      await prisma.aPIKey.update({
        where: { id: keyRecord.id },
        data: { 
          lastUsedAt: new Date(),
          usageCount: { increment: 1 }
        }
      });

      return { success: true, keyRecord };
    } catch (error) {
      throw new Error(`API key validation failed: ${error.message}`);
    }
  }
}

module.exports = ConsumerPulseService;
