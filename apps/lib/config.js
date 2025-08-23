// API Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000',
    environment: 'development'
  },
  production: {
    apiUrl: 'https://baltar-inc-1.onrender.com',
    environment: 'production'
  }
};

// Get the current environment
const getEnvironment = () => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  }
  
  // Server-side environment detection
  return process.env.NODE_ENV || 'development';
};

// Get the API URL based on environment
export const getApiUrl = () => {
  const env = getEnvironment();

  // Use environment variable if available, otherwise fall back to config
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return config[env]?.apiUrl || config.development.apiUrl;
};

// Get full API endpoint URL
export const getApiEndpoint = (path) => {
  const baseUrl = getApiUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Export configuration
export default {
  apiUrl: getApiUrl(),
  environment: getEnvironment(),
  isProduction: getEnvironment() === 'production',
  isDevelopment: getEnvironment() === 'development'
};
