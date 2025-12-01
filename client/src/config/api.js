// Central API configuration
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Debug: Log API base URL (remove in production if needed)
if (typeof window !== 'undefined') {
  console.log('🔧 API Base URL:', API_BASE)
  if (!import.meta.env.VITE_API_BASE) {
    console.warn('⚠️ VITE_API_BASE not set! Using default:', API_BASE)
    console.warn('⚠️ Set VITE_API_BASE in Vercel environment variables!')
  }
}


