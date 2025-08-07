// Centralized environment configuration
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl(),
  
  // App Information
  appName: import.meta.env.VITE_APP_NAME || 'Minimalist-It',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Mode
  mode: import.meta.env.MODE,
} as const;

// Fallback API URL logic
function getDefaultApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api';
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production fallback
  if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
    return 'https://minimalist-it.onrender.com/api';
  }
  
  // Local network
  return `${protocol}//${hostname}:5000/api`;
}

// Validation function
export function validateConfig() {
  const requiredEnvVars = [
    'VITE_API_BASE_URL',
  ];

  const missing = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missing.length > 0 && config.isProduction) {
    console.warn('⚠️ Missing environment variables:', missing);
  }

  // Log configuration in development
  if (config.isDevelopment) {
    console.log('🔧 App Configuration:', {
      apiBaseUrl: config.apiBaseUrl,
      appName: config.appName,
      appVersion: config.appVersion,
      mode: config.mode,
      environment: config.isProduction ? 'production' : 'development',
    });
  }
}

// Auto-validate on import
validateConfig();
