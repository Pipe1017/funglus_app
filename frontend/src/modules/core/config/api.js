// frontend/src/modules/core/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_URL

export const config = {
  apiUrl: API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME || 'FunglusApp',
  environment: import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE,
}

console.log('🔧 API URL:', API_BASE_URL)