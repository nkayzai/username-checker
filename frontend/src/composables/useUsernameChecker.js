import { ref, computed } from 'vue'
import axios from 'axios'

// Global state
const results = ref([])
const loading = ref(false)
const error = ref(null)
const progress = ref(0)
const currentSite = ref(null)

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for username checking
  headers: {
    'Content-Type': 'application/json'
  }
})

export function useUsernameChecker() {
  // Computed properties
  const hasResults = computed(() => results.value.length > 0)
  
  const stats = computed(() => ({
    total: results.value.length,
    available: results.value.filter(r => r.status === 'available').length,
    taken: results.value.filter(r => r.status === 'taken').length,
    unknown: results.value.filter(r => r.status === 'unknown').length
  }))

  // Methods
  const checkUsername = async (username) => {
    if (!username || username.trim().length === 0) {
      error.value = 'Please enter a username'
      return
    }

    // Reset state
    results.value = []
    error.value = null
    progress.value = 0
    currentSite.value = null
    loading.value = true

    try {
      console.log(`Checking username: ${username}`)
      
      // Make API request
      const response = await api.post('/check-username', {
        username: username.trim()
      })

      if (response.data && response.data.results) {
        results.value = response.data.results
        console.log(`Received ${response.data.results.length} results`)
      } else {
        throw new Error('Invalid response format')
      }

    } catch (err) {
      console.error('Error checking username:', err)
      
      if (err.response) {
        // Server responded with error status
        error.value = (err.response.data && err.response.data.error) || `Server error: ${err.response.status}`
      } else if (err.request) {
        // Request was made but no response received
        error.value = 'Unable to connect to server. Please check your internet connection.'
      } else {
        // Something else happened
        error.value = err.message || 'An unexpected error occurred'
      }
      
      results.value = []
    } finally {
      loading.value = false
      progress.value = 100
      currentSite.value = null
    }
  }

  const clearResults = () => {
    results.value = []
    error.value = null
    progress.value = 0
    currentSite.value = null
  }

  const retryLastCheck = () => {
    if (results.value.length > 0) {
      const lastUsername = results.value[0] && results.value[0].username
      if (lastUsername) {
        checkUsername(lastUsername)
      }
    }
  }

  // Simulate progress updates (in a real app, this would come from WebSocket or Server-Sent Events)
  const simulateProgress = () => {
    if (!loading.value) return
    
    let currentProgress = 0
    const sites = [
      'GitHub', 'Twitter', 'Instagram', 'TikTok', 'YouTube', 'Reddit', 
      'Discord', 'Twitch', 'LinkedIn', 'Medium', 'Dev.to', 'CodePen',
      'Stack Overflow', 'Behance', 'Dribbble', 'Pinterest', 'Snapchat',
      'Spotify', 'SoundCloud'
    ]
    
    const interval = setInterval(() => {
      if (!loading.value) {
        clearInterval(interval)
        return
      }
      
      currentProgress += Math.random() * 10
      if (currentProgress > 90) currentProgress = 90
      
      progress.value = currentProgress
      
      // Update current site
      const siteIndex = Math.floor((currentProgress / 100) * sites.length)
      if (siteIndex < sites.length) {
        currentSite.value = sites[siteIndex]
      }
    }, 500)
    
    return interval
  }

  // Start progress simulation when loading starts
  const startProgressSimulation = () => {
    if (loading.value) {
      return simulateProgress()
    }
  }

  return {
    // State
    results,
    loading,
    error,
    progress,
    currentSite,
    
    // Computed
    hasResults,
    stats,
    
    // Methods
    checkUsername,
    clearResults,
    retryLastCheck,
    startProgressSimulation
  }
}
