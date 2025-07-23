/**
 * News API Configuration
 * 
 * Central configuration for switching between different news APIs
 */

const config = {
  // Current active API provider
  activeProvider: 'newsdata', // Options: 'newsdata', 'currents'
  
  // API Keys and configurations
  providers: {
    newsdata: {
      apiKey: 'pub_e153bfe8af5b43be88dd4602c4a716d3',
      baseUrl: 'https://newsdata.io/api/1',
      defaultParams: {
        language: 'en',
        size: 30
      },
      rateLimit: {
        requestsPerHour: 200,
        requestsPerDay: 1000
      }
    },
    
    currents: {
      apiKey: 'cC58gtz11939xJr6zscGWn3hTUrb5ZV8McYZHRQjfXjlKa1k',
      baseUrl: 'https://api.currentsapi.services/v1',
      defaultParams: {
        language: 'en',
        page_size: 30
      },
      rateLimit: {
        requestsPerHour: 50,
        requestsPerDay: 600
      }
    }
  },
  
  // Scheduling configuration
  scheduling: {
    intervalHours: 2, // Fetch every 2 hours
    maxRequestsPerDay: 12,
    cleanupDays: 7 // Keep articles for 7 days
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
