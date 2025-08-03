/**
 * News API Configuration
 * 
 * Central configuration for switching between different news APIs
 */

const config = {
  // Current active API provider - will rotate automatically
  activeProvider: 'newsdata', // Options: 'newsdata', 'newsapi', 'finlight', 'currents'

  // API Keys and configurations
  providers: {
    newsdata: {
      name: 'NewsData.io',
      apiKey: process.env.NEWSDATA_API_KEY,
      baseUrl: 'https://newsdata.io/api/1',
      defaultParams: {
        language: 'en',
        size: 30
      },
      rateLimit: {
        requestsPerDay: 200, // Updated to match actual limit
        requestsPerHour: 8,  // Spread across 24 hours
        priority: 1,
        categories: ['general', 'business', 'technology', 'politics']
      }
    },

    newsapi: {
      name: 'NewsAPI.org',
      apiKey: process.env.NEWSAPI_API_KEY,
      baseUrl: 'https://newsapi.org/v2',
      defaultParams: {
        language: 'en',
        pageSize: 30,
        sortBy: 'publishedAt'
      },
      rateLimit: {
        requestsPerDay: 1000,
        requestsPerHour: 41, // Spread across 24 hours
        priority: 2,
        categories: ['general', 'business', 'technology', 'science', 'health']
      }
    },

    finlight: {
      name: 'Finlight API',
      apiKey: process.env.FINLIGHT_API_KEY,
      baseUrl: 'https://api.finlight.com/v1',
      defaultParams: {
        limit: 30
      },
      rateLimit: {
        requestsPerMonth: 5000,
        requestsPerDay: 166, // Spread across 30 days
        requestsPerHour: 7,  // Spread across 24 hours
        priority: 3,
        categories: ['finance', 'crypto', 'markets', 'economics']
      }
    },

    currents: {
      name: 'Currents API',
      apiKey: process.env.CURRENTS_API_KEY,
      baseUrl: 'https://api.currentsapi.services/v1',
      defaultParams: {
        language: 'en',
        page_size: 30
      },
      rateLimit: {
        requestsPerDay: 600,
        requestsPerHour: 25,
        priority: 4,
        categories: ['general', 'business', 'technology', 'sports']
      }
    }
  },
  
  // Intelligent scheduling configuration
  scheduling: {
    intervalMinutes: 30, // Check every 30 minutes for new content
    maxRequestsPerDay: 100, // Total across all APIs
    cleanupDays: 7, // Keep articles for 7 days
    rotationStrategy: 'priority', // 'priority', 'round-robin', 'adaptive'
    categories: {
      global: ['general', 'politics', 'world'],
      financial: ['business', 'finance', 'economics'],
      crypto: ['crypto', 'cryptocurrency', 'bitcoin'],
      technology: ['technology', 'science'],
      health: ['health', 'medical'],
      sports: ['sports']
    }
  },

  // WebSocket configuration
  websocket: {
    enabled: true,
    port: 3001,
    events: {
      newArticle: 'news:new-article',
      updateArticle: 'news:update-article',
      bulkUpdate: 'news:bulk-update',
      apiStatus: 'news:api-status'
    }
  },
  
  // Duplicate detection settings
  duplicateDetection: {
    titleSimilarityThreshold: 0.75,
    summarySimilarityThreshold: 0.8,
    checkRecentHours: 24
  },
  
  // Image fallback
  fallbackImage: '/consumer-pulse-banner.svg'
};

/**
 * Get current provider configuration
 */
function getCurrentProvider() {
  const provider = config.providers[config.activeProvider];
  if (!provider) {
    throw new Error(`Invalid provider: ${config.activeProvider}`);
  }
  return {
    name: config.activeProvider,
    ...provider
  };
}

/**
 * Switch to a different provider
 */
function switchProvider(providerName) {
  if (!config.providers[providerName]) {
    throw new Error(`Provider not found: ${providerName}`);
  }
  config.activeProvider = providerName;
  console.log(`📡 Switched to ${providerName} API provider`);
}

/**
 * Get scheduling configuration
 */
function getSchedulingConfig() {
  return config.scheduling;
}

/**
 * Get duplicate detection settings
 */
function getDuplicateDetectionConfig() {
  return config.duplicateDetection;
}

module.exports = {
  config,
  getCurrentProvider,
  switchProvider,
  getSchedulingConfig,
  getDuplicateDetectionConfig
};
