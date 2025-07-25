// Environment Configuration
// Modify these values based on your environment

export const ENVIRONMENT = {
  // Set to 'development' for local development, 'production' for production
  NODE_ENV: import.meta.env.MODE || 'production',
  
  // API Base URLs
  DEVELOPMENT_API_URL: 'http://localhost:8000',
  PRODUCTION_API_URL: 'https://complain-management-be-1079206590069.europe-west1.run.app',
  
  // API Version
  API_VERSION: 'v1',
};

// Determine the correct API base URL
export const getApiBaseUrl = (): string => {
  return ENVIRONMENT.NODE_ENV === 'development' 
    ? ENVIRONMENT.DEVELOPMENT_API_URL 
    : ENVIRONMENT.PRODUCTION_API_URL;
};

// Full API URL
export const getApiUrl = (): string => {
  return `${getApiBaseUrl()}/api/${ENVIRONMENT.API_VERSION}`;
};

// Export for convenience
export const API_BASE_URL = getApiBaseUrl();
export const API_URL = getApiUrl();

// Environment info for debugging
export const ENV_INFO = {
  nodeEnv: ENVIRONMENT.NODE_ENV,
  isDevelopment: ENVIRONMENT.NODE_ENV === 'development',
  isProduction: ENVIRONMENT.NODE_ENV === 'production',
  apiBaseUrl: API_BASE_URL,
  apiUrl: API_URL,
}; 