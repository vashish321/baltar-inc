const axios = require('axios');

class AIService {
  constructor() {
    // Configuration for different AI providers
    this.providers = {
      groq: {
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: 'https://api.groq.com/openai/v1',
        model: 'llama-3.1-8b-instant' // Updated to supported model
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo'
      },
      huggingface: {
        apiKey: process.env.HUGGINGFACE_API_KEY,
        baseUrl: 'https://api-inference.huggingface.co/models'
      }
    };
  }

  // Advanced Sentiment Analysis for Survey Responses (AI-Powered)
  async analyzeSurveyResponseSentiment(text, demographics = {}, provider = 'groq') {
    try {
      switch (provider) {
        case 'groq':
          return await this.groqSurveyResponseSentimentAnalysis(text, demographics);
        case 'openai':
          return await this.openAISurveyResponseSentimentAnalysis(text, demographics);
        case 'huggingface':
          return await this.huggingFaceSurveyResponseSentimentAnalysis(text, demographics);
        default:
          return this.localSurveyResponseSentimentAnalysis(text, demographics);
      }
    } catch (error) {
      console.error('Groq sentiment analysis failed:', error.message);
      throw error; // Force Groq to work, no fallback
    }
  }

  // Basic sentiment analysis (for non-survey content)
  async analyzeSentiment(text, provider = 'local') {
    try {
      if (provider === 'local') {
        return this.localSentimentAnalysis(text);
      }
      // For non-survey content, use basic local analysis
      return this.localSentimentAnalysis(text);
    } catch (error) {
      console.error('Error in basic sentiment analysis:', error);
      return this.localSentimentAnalysis(text);
    }
  }

  // Local sentiment analysis (rule-based)
  localSentimentAnalysis(text) {
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive',
      'love', 'like', 'enjoy', 'happy', 'pleased', 'satisfied', 'success', 'growth',
      'increase', 'improve', 'better', 'best', 'strong', 'confident', 'optimistic',
      'beneficial', 'advantage', 'opportunity', 'progress', 'achievement', 'win'
    ];

    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'negative', 'hate', 'dislike',
      'sad', 'angry', 'disappointed', 'frustrated', 'problem', 'issue', 'concern',
      'decline', 'decrease', 'fall', 'drop', 'weak', 'poor', 'worst', 'fail',
      'loss', 'crisis', 'risk', 'threat', 'challenge', 'difficulty', 'struggle'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w]/g, '');
      
      if (positiveWords.some(pw => cleanWord.includes(pw))) {
        positiveCount++;
      }
      if (negativeWords.some(nw => cleanWord.includes(nw))) {
        negativeCount++;
      }
    });

    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords === 0) {
      return {
        sentiment: 'NEUTRAL',
        score: 0,
        confidence: 0.5,
        details: { positive: 0, negative: 0, neutral: 1 }
      };
    }

    const score = (positiveCount - negativeCount) / totalSentimentWords;
    const confidence = Math.min(totalSentimentWords / words.length * 10, 1);

    let sentiment;
    if (score > 0.2) sentiment = 'POSITIVE';
    else if (score < -0.2) sentiment = 'NEGATIVE';
    else sentiment = 'NEUTRAL';

    return {
      sentiment,
      score,
      confidence,
      details: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: words.length - totalSentimentWords
      }
    };
  }

  // Enhanced local sentiment analysis for survey responses with demographic awareness
  localSurveyResponseSentimentAnalysis(text, demographics = {}) {
    // Enhanced keyword-based sentiment analysis with demographic awareness
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive',
      'love', 'like', 'enjoy', 'happy', 'pleased', 'satisfied', 'success', 'awesome',
      'perfect', 'brilliant', 'outstanding', 'superb', 'delighted', 'thrilled'
    ];

    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'negative', 'hate', 'dislike',
      'sad', 'angry', 'disappointed', 'frustrated', 'poor', 'worst', 'disgusting',
      'annoying', 'useless', 'pathetic', 'ridiculous', 'unacceptable'
    ];

    // Emotion keywords for detailed analysis
    const emotionKeywords = {
      happy: ['happy', 'joy', 'cheerful', 'delighted', 'pleased', 'content'],
      excited: ['excited', 'thrilled', 'enthusiastic', 'eager', 'pumped'],
      frustrated: ['frustrated', 'annoyed', 'irritated', 'bothered', 'aggravated'],
      disappointed: ['disappointed', 'let down', 'upset', 'sad', 'discouraged'],
      surprised: ['surprised', 'shocked', 'amazed', 'unexpected', 'stunned'],
      confused: ['confused', 'puzzled', 'unclear', 'lost', 'bewildered']
    };

    // Theme keywords for market research insights
    const themeKeywords = {
      price: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'value', 'money', 'budget'],
      quality: ['quality', 'good', 'bad', 'excellent', 'poor', 'high-quality', 'low-quality'],
      service: ['service', 'staff', 'help', 'support', 'customer service', 'assistance', 'team'],
      speed: ['fast', 'slow', 'quick', 'rapid', 'delayed', 'immediate', 'waiting'],
      convenience: ['convenient', 'easy', 'difficult', 'simple', 'complicated', 'accessible'],
      design: ['design', 'look', 'appearance', 'interface', 'layout', 'visual'],
      features: ['feature', 'function', 'capability', 'option', 'tool', 'functionality']
    };

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    // Detect emotions
    const detectedEmotions = [];
    Object.keys(emotionKeywords).forEach(emotion => {
      if (emotionKeywords[emotion].some(keyword => text.toLowerCase().includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    });

    // Detect themes
    const detectedThemes = [];
    Object.keys(themeKeywords).forEach(theme => {
      if (themeKeywords[theme].some(keyword => text.toLowerCase().includes(keyword))) {
        detectedThemes.push(theme);
      }
    });

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (positiveWords.some(pw => cleanWord.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => cleanWord.includes(nw))) negativeCount++;
    });

    const totalWords = positiveCount + negativeCount;
    let score = 0;
    let sentiment = 'NEUTRAL';
    let intensity = 'MEDIUM';

    if (totalWords > 0) {
      score = (positiveCount - negativeCount) / totalWords;

      if (score > 0.3) {
        sentiment = 'POSITIVE';
        intensity = score > 0.6 ? 'HIGH' : 'MEDIUM';
      } else if (score < -0.3) {
        sentiment = 'NEGATIVE';
        intensity = score < -0.6 ? 'HIGH' : 'MEDIUM';
      } else {
        intensity = 'LOW';
      }
    }

    return {
      sentiment,
      score: Math.max(-1, Math.min(1, score)),
      confidence: Math.min(0.8, totalWords / words.length * 5),
      emotions: detectedEmotions,
      themes: detectedThemes,
      intensity,
      provider: 'local',
      demographics: demographics,
      timestamp: new Date().toISOString(),
      details: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: words.length - totalWords,
        totalWords: words.length
      }
    };
  }

  // Optimized Groq sentiment analysis for survey responses (minimal prompt)
  async groqSurveyResponseSentimentAnalysis(text, demographics = {}) {
    if (!this.providers.groq.apiKey) {
      throw new Error('Groq API key not configured');
    }

    // Validate and clean the text
    if (!text || text === 'undefined' || text.trim() === '') {
      throw new Error('Invalid text for sentiment analysis');
    }

    // Keep text very short for Groq API
    const cleanText = text.replace(/undefined/g, '').replace(/"/g, "'").trim();
    const limitedText = cleanText.length > 100 ? cleanText.substring(0, 100) : cleanText;

    if (limitedText.length < 2) {
      throw new Error('Text too short for meaningful sentiment analysis');
    }

    try {
      const response = await axios.post(
        `${this.providers.groq.baseUrl}/chat/completions`,
        {
          model: this.providers.groq.model,
          messages: [
            {
              role: 'system',
              content: 'Respond with JSON only. No text before or after. Example: {"sentiment":"POSITIVE","score":0.8,"confidence":0.9}'
            },
            {
              role: 'user',
              content: `Text: "${limitedText}". Return JSON with sentiment (POSITIVE/NEGATIVE/NEUTRAL), score (-1 to 1), confidence (0 to 1).`
            }
          ],
          temperature: 0.0,
          max_tokens: 40
        },
        {
          headers: {
            'Authorization': `Bearer ${this.providers.groq.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000
        }
      );

      const responseText = response.data.choices[0].message.content.trim();

      // Clean and parse JSON response with multiple fallback strategies
      let result;
      try {
        // First try direct parsing
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.log('Direct JSON parse failed, trying extraction. Response:', responseText.substring(0, 100));

        // Strategy 1: Remove markdown code blocks
        let cleanText = responseText.replace(/```json\s*|\s*```/g, '');

        // Strategy 2: Find JSON object with better regex
        const jsonMatch = cleanText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (secondParseError) {
            // Strategy 3: Try to construct JSON from text patterns
            const sentimentMatch = responseText.match(/(POSITIVE|NEGATIVE|NEUTRAL)/i);
            const scoreMatch = responseText.match(/(-?\d*\.?\d+)/);
            const confidenceMatch = responseText.match(/(\d*\.?\d+)/);

            if (sentimentMatch) {
              result = {
                sentiment: sentimentMatch[1].toUpperCase(),
                score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
                confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5
              };
            } else {
              throw new Error(`Cannot extract sentiment from: ${responseText.substring(0, 100)}...`);
            }
          }
        } else {
          throw new Error(`No JSON pattern found in: ${responseText.substring(0, 100)}...`);
        }
      }

      return {
        sentiment: result.sentiment || 'NEUTRAL',
        score: result.score || 0,
        confidence: result.confidence || 0.5,
        emotions: [],
        themes: [],
        intensity: 'MEDIUM',
        provider: 'groq',
        demographics: demographics,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Groq API error:', error.response?.status, error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  // Build demographic context for better sentiment analysis
  buildDemographicContext(demographics) {
    const context = [];

    if (demographics.age) {
      context.push(`Respondent age: ${demographics.age}`);
    }
    if (demographics.gender) {
      context.push(`Gender: ${demographics.gender}`);
    }
    if (demographics.location) {
      context.push(`Location: ${demographics.location}`);
    }
    if (demographics.income) {
      context.push(`Income level: ${demographics.income}`);
    }
    if (demographics.education) {
      context.push(`Education: ${demographics.education}`);
    }

    return context.length > 0
      ? `Demographic context: ${context.join(', ')}`
      : 'No demographic context provided';
  }

  // OpenAI sentiment analysis
  async openAISentimentAnalysis(text) {
    if (!this.providers.openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await axios.post(
      `${this.providers.openai.baseUrl}/chat/completions`,
      {
        model: this.providers.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with a JSON object containing: sentiment (POSITIVE, NEGATIVE, or NEUTRAL), score (number between -1 and 1), and confidence (number between 0 and 1).'
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this text: "${text}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    return {
      sentiment: result.sentiment,
      score: result.score,
      confidence: result.confidence,
      provider: 'openai'
    };
  }

  // Hugging Face sentiment analysis
  async huggingFaceSentimentAnalysis(text) {
    if (!this.providers.huggingface.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const response = await axios.post(
      `${this.providers.huggingface.baseUrl}/cardiffnlp/twitter-roberta-base-sentiment-latest`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.huggingface.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const results = response.data[0];
    const sentimentMap = {
      'LABEL_0': 'NEGATIVE',
      'LABEL_1': 'NEUTRAL', 
      'LABEL_2': 'POSITIVE'
    };

    const topResult = results.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );

    return {
      sentiment: sentimentMap[topResult.label] || 'NEUTRAL',
      score: topResult.label === 'LABEL_2' ? topResult.score : 
             topResult.label === 'LABEL_0' ? -topResult.score : 0,
      confidence: topResult.score,
      provider: 'huggingface',
      details: results
    };
  }

  // Generate insights from survey data
  async generateSurveyInsights(surveyData, responses) {
    try {
      if (this.providers.groq.apiKey) {
        return await this.groqGenerateInsights(surveyData, responses);
      } else if (this.providers.openai.apiKey) {
        return await this.openAIGenerateInsights(surveyData, responses);
      } else {
        return this.localGenerateInsights(surveyData, responses);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.localGenerateInsights(surveyData, responses);
    }
  }

  // Local insights generation
  localGenerateInsights(surveyData, responses) {
    const totalResponses = responses.length;
    if (totalResponses === 0) {
      return {
        summary: 'No responses collected yet.',
        keyFindings: [],
        recommendations: ['Increase survey promotion to gather more responses.']
      };
    }

    // Analyze response patterns
    const insights = {
      summary: `Survey "${surveyData.title}" has collected ${totalResponses} responses.`,
      keyFindings: [
        `Response rate: ${totalResponses} participants`,
        'Data collection is ongoing',
        'Initial patterns are emerging'
      ],
      recommendations: [
        'Continue data collection for more robust insights',
        'Consider demographic segmentation',
        'Monitor response quality and completion rates'
      ]
    };

    // Add specific insights based on response count
    if (totalResponses > 50) {
      insights.keyFindings.push('Sufficient sample size for preliminary analysis');
      insights.recommendations.push('Begin detailed demographic analysis');
    }

    if (totalResponses > 100) {
      insights.keyFindings.push('Strong response rate indicates high engagement');
      insights.recommendations.push('Consider expanding survey reach');
    }

    return insights;
  }

  // Optimized Groq insights generation (minimal prompt)
  async groqGenerateInsights(surveyData, responses) {
    // Extract only essential response data
    const essentialResponses = responses.slice(0, 3).map(r => {
      try {
        const parsed = JSON.parse(r.responses);
        return Object.values(parsed).join(', ');
      } catch {
        return 'No response';
      }
    });

    const prompt = `Survey: ${surveyData.title}
Responses (${responses.length}): ${essentialResponses.join(' | ')}
Return JSON: {"summary":"","keyFindings":[""],"recommendations":[""]}`;

    const response = await axios.post(
      `${this.providers.groq.baseUrl}/chat/completions`,
      {
        model: this.providers.groq.model,
        messages: [
          {
            role: 'system',
            content: 'You are a JSON API. Respond ONLY with valid JSON. No text, no explanations, no markdown. Just JSON.'
          },
          {
            role: 'user',
            content: `{"task":"survey_analysis","data":"${prompt}","format":{"summary":"string","keyFindings":["string"],"recommendations":["string"]}}`
          }
        ],
        temperature: 0.0,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.groq.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  }

  // OpenAI insights generation
  async openAIGenerateInsights(surveyData, responses) {
    const prompt = `
      Analyze this survey data and provide insights:
      
      Survey: ${surveyData.title}
      Description: ${surveyData.description}
      Total Responses: ${responses.length}
      
      Please provide:
      1. A brief summary
      2. Key findings (3-5 points)
      3. Actionable recommendations (3-5 points)
      
      Respond in JSON format with summary, keyFindings array, and recommendations array.
    `;

    const response = await axios.post(
      `${this.providers.openai.baseUrl}/chat/completions`,
      {
        model: this.providers.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a market research analyst. Provide insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  }

  // Generate article content with market research angle
  async enhanceArticleContent(originalArticle) {
    try {
      if (this.providers.groq.apiKey) {
        return await this.groqEnhanceArticle(originalArticle);
      } else if (this.providers.openai.apiKey) {
        return await this.openAIEnhanceArticle(originalArticle);
      } else {
        return this.localEnhanceArticle(originalArticle);
      }
    } catch (error) {
      console.error('Error enhancing article:', error);
      return this.localEnhanceArticle(originalArticle);
    }
  }

  // Local article enhancement
  localEnhanceArticle(article) {
    const marketResearchKeywords = [
      'consumer behavior', 'market trends', 'survey data', 'polling results',
      'consumer sentiment', 'market research', 'business analytics'
    ];

    const enhancedContent = `
      ${article.content}
      
      Market Research Perspective:
      This development has significant implications for consumer behavior and market dynamics. 
      Recent polling data suggests that consumer sentiment in this sector is evolving rapidly.
      
      Businesses should consider conducting targeted surveys to understand how these changes 
      might affect their customer base. Our Consumer Pulse platform provides real-time 
      insights into consumer preferences and market trends.
      
      Key Market Research Indicators:
      • Consumer confidence levels
      • Purchasing behavior patterns  
      • Brand sentiment analysis
      • Market opportunity assessment
      
      For comprehensive market research and consumer insights, businesses can access our 
      analytics platform for detailed demographic breakdowns and sentiment analysis.
    `;

    return {
      ...article,
      content: enhancedContent,
      keywords: [...(article.keywords || []), ...marketResearchKeywords.slice(0, 3)]
    };
  }

  // Groq article enhancement
  async groqEnhanceArticle(article) {
    // Validate article content
    if (!article.content || article.content === 'undefined' || article.content.trim() === '') {
      throw new Error('Invalid article content for enhancement');
    }

    // Clean and limit content
    const cleanContent = article.content.replace(/undefined/g, '').trim();
    const limitedContent = cleanContent.length > 500 ? cleanContent.substring(0, 500) + '...' : cleanContent;

    const prompt = `
      Enhance this news article with a market research and consumer behavior perspective:

      Title: ${article.title}
      Content: ${limitedContent}

      Add insights about:
      - Consumer behavior implications
      - Market research relevance
      - Business analytics perspective
      - Strategic recommendations for businesses

      Return the enhanced article with the same structure but expanded content.
    `;

    const response = await axios.post(
      `${this.providers.groq.baseUrl}/chat/completions`,
      {
        model: this.providers.groq.model,
        messages: [
          {
            role: 'system',
            content: 'You are a market research content specialist. Enhance articles with consumer insights perspective.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.groq.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const enhancedContent = response.data.choices[0].message.content;

    return {
      ...article,
      content: enhancedContent,
      keywords: [...(article.keywords || []), 'market research', 'consumer behavior', 'business analytics']
    };
  }

  // OpenAI article enhancement
  async openAIEnhanceArticle(article) {
    const prompt = `
      Enhance this news article with a market research and consumer behavior perspective:
      
      Title: ${article.title}
      Content: ${article.content}
      
      Please:
      1. Add market research insights
      2. Include consumer behavior implications
      3. Suggest relevant survey questions
      4. Add SEO keywords related to market research
      5. Maintain the original tone and factual accuracy
      
      Return the enhanced article with the same structure but expanded content.
    `;

    const response = await axios.post(
      `${this.providers.openai.baseUrl}/chat/completions`,
      {
        model: this.providers.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a market research content specialist. Enhance articles with consumer insights perspective.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const enhancedContent = response.data.choices[0].message.content;
    
    return {
      ...article,
      content: enhancedContent,
      keywords: [...(article.keywords || []), 'market research', 'consumer behavior', 'business analytics']
    };
  }

  // Batch sentiment analysis for multiple texts
  async batchSentimentAnalysis(texts, provider = 'local') {
    const results = [];
    
    for (const text of texts) {
      try {
        const sentiment = await this.analyzeSentiment(text, provider);
        results.push(sentiment);
      } catch (error) {
        console.error('Error in batch sentiment analysis:', error);
        results.push(this.localSentimentAnalysis(text));
      }
    }
    
    return results;
  }
}

module.exports = AIService;
