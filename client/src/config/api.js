// Central API configuration
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Debug: Log API base URL and expose to window for console debugging
if (typeof window !== 'undefined') {
  console.log('🔧 API Base URL:', API_BASE)
  if (!import.meta.env.VITE_API_BASE) {
    console.warn('⚠️ VITE_API_BASE not set! Using default:', API_BASE)
    console.warn('⚠️ Set VITE_API_BASE in Vercel environment variables!')
  }
  
  // Expose to window for easy debugging in console
  window.__API_BASE__ = API_BASE
  window.__VITE_API_BASE__ = import.meta.env.VITE_API_BASE
  console.log('💡 Tip: Check API base with: window.__API_BASE__ or window.__VITE_API_BASE__')
}


