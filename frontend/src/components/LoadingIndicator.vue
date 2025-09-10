<template>
  <div class="text-center">
    <div class="mb-6">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div class="spinner w-8 h-8"></div>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Checking Username Availability</h3>
      <p class="text-gray-600">Scanning multiple platforms to find available usernames...</p>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">Progress</span>
        <span class="text-sm text-gray-600">{{ Math.round(progress) }}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Current Site -->
    <div v-if="currentSite" class="mb-6">
      <div class="inline-flex items-center space-x-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <div class="spinner w-4 h-4"></div>
        </div>
        <div class="text-left">
          <div class="text-sm font-medium text-gray-900">Checking {{ currentSite }}</div>
          <div class="text-xs text-gray-600">Please wait...</div>
        </div>
      </div>
    </div>

    <!-- Loading Tips -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <div class="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle class="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-1">Multi-Platform Check</h4>
          <p class="text-xs text-gray-600">Scanning 20+ popular platforms including social media, development sites, and creative platforms</p>
        </div>
      </div>

      <div class="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-1">Advanced Detection</h4>
          <p class="text-xs text-gray-600">Using fuzzy matching and multi-page detection to ensure accurate results</p>
        </div>
      </div>

      <div class="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Zap class="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-1">Fast & Reliable</h4>
          <p class="text-xs text-gray-600">Concurrent checking with retry logic for the most reliable results</p>
        </div>
      </div>
    </div>

    <!-- Estimated Time -->
    <div class="mt-6 text-sm text-gray-500">
      <Clock class="w-4 h-4 inline mr-1" />
      Estimated time: 10-30 seconds
    </div>
  </div>
</template>

<script setup>
import { CheckCircle, Shield, Zap, Clock } from 'lucide-vue-next'

// Props
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  currentSite: {
    type: String,
    default: null
  }
})
</script>
