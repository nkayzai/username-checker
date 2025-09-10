<template>
  <div 
    class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
    :class="statusClasses"
    @click="openUrl"
  >
    <!-- Status Indicator Bar -->
    <div 
      class="absolute top-0 left-0 w-full h-1"
      :class="statusBarClasses"
    ></div>

    <!-- Gradient Overlay for Hover Effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    <div class="relative p-6">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <!-- Enhanced Site Logo -->
          <div class="relative">
            <div class="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200 group-hover:scale-105 transition-transform duration-300">
              <img 
                v-if="result.logo" 
                :src="result.logo" 
                :alt="`${result.site} logo`"
                class="w-10 h-10 object-contain"
                @error="handleImageError"
              />
              <div v-else class="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                <Globe class="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <!-- Status Icon Overlay -->
            <div 
              class="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm border-2 border-white"
              :class="statusIconClasses"
            >
              <component :is="statusIcon" class="w-3 h-3" />
            </div>
          </div>

          <!-- Site Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
              {{ result.site }}
            </h4>
            <p class="text-sm text-gray-500 truncate capitalize">
              {{ result.category }}
            </p>
            <div class="flex items-center space-x-2 mt-1">
              <div class="w-2 h-2 rounded-full" :class="statusDotClasses"></div>
              <span class="text-xs font-medium" :class="statusTextClasses">{{ statusText }}</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex items-center space-x-2">
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            :class="actionButtonClasses"
          >
            <ExternalLink class="w-5 h-5" :class="actionIconClasses" />
          </div>
        </div>
      </div>

      <!-- Additional Details with Better Layout -->
      <div v-if="result.details || result.error" class="space-y-3">
        <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        
        <div v-if="result.details" class="space-y-2">
          <div v-if="result.details.title" class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <div class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-xs font-bold text-blue-600">T</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-700 mb-1">Page Title</p>
                <p class="text-sm text-gray-900 truncate">{{ result.details.title }}</p>
              </div>
            </div>
          </div>

          <div v-if="result.details.statusCode" class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-xs font-bold text-green-600">S</span>
              </div>
              <span class="text-xs font-medium text-gray-700">HTTP Status</span>
            </div>
            <span 
              class="px-2 py-1 rounded-lg text-xs font-bold"
              :class="getStatusCodeClass(result.details.statusCode)"
            >
              {{ result.details.statusCode }}
            </span>
          </div>

          <div v-if="result.details.hasProfileImage" class="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
            <div class="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
              <User class="w-3 h-3 text-purple-600" />
            </div>
            <span class="text-sm text-gray-700">Profile image detected</span>
          </div>
        </div>
        
        <div v-if="result.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <div class="flex items-center space-x-2">
            <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0" />
            <span class="text-sm text-red-700">{{ result.error }}</span>
          </div>
        </div>
      </div>

      <!-- Footer with Enhanced Info -->
      <div class="mt-4 pt-3 border-t border-gray-100">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 rounded-full bg-green-400"></div>
              <span>{{ result.responseTime }}ms</span>
            </div>
            <div class="flex items-center space-x-1">
              <Clock class="w-3 h-3" />
              <span>{{ formatTimestamp(result.timestamp) }}</span>
            </div>
          </div>
          <div class="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
            Click to visit →
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ExternalLink, Globe, User, AlertCircle, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-vue-next'

// Props
const props = defineProps({
  result: {
    type: Object,
    required: true
  }
})

// Computed properties
const statusClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'hover:border-green-200'
    case 'taken':
      return 'hover:border-red-200'
    case 'unknown':
      return 'hover:border-yellow-200'
    default:
      return ''
  }
})

const statusBarClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'bg-gradient-to-r from-green-400 to-green-500'
    case 'taken':
      return 'bg-gradient-to-r from-red-400 to-red-500'
    case 'unknown':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    default:
      return 'bg-gray-300'
  }
})

const statusIcon = computed(() => {
  switch (props.result.status) {
    case 'available':
      return CheckCircle
    case 'taken':
      return XCircle
    case 'unknown':
      return HelpCircle
    default:
      return HelpCircle
  }
})

const statusIconClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'bg-green-500 text-white'
    case 'taken':
      return 'bg-red-500 text-white'
    case 'unknown':
      return 'bg-yellow-500 text-white'
    default:
      return 'bg-gray-400 text-white'
  }
})

const statusDotClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'bg-green-400'
    case 'taken':
      return 'bg-red-400'
    case 'unknown':
      return 'bg-yellow-400'
    default:
      return 'bg-gray-400'
  }
})

const statusTextClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'text-green-600'
    case 'taken':
      return 'text-red-600'
    case 'unknown':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
})

const actionButtonClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'bg-green-50 hover:bg-green-100 border border-green-200'
    case 'taken':
      return 'bg-red-50 hover:bg-red-100 border border-red-200'
    case 'unknown':
      return 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'
    default:
      return 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
  }
})

const actionIconClasses = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'text-green-600'
    case 'taken':
      return 'text-red-600'
    case 'unknown':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
})

const statusText = computed(() => {
  switch (props.result.status) {
    case 'available':
      return 'Available'
    case 'taken':
      return 'Taken'
    case 'unknown':
      return 'Unknown'
    default:
      return 'Unknown'
  }
})

// Methods
const openUrl = () => {
  if (props.result.url) {
    window.open(props.result.url, '_blank', 'noopener,noreferrer')
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  if (event.target.nextElementSibling) {
    event.target.nextElementSibling.style.display = 'flex'
  }
}

const getStatusCodeClass = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'bg-green-100 text-green-800'
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'bg-red-100 text-red-800'
  } else if (statusCode >= 500) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-gray-100 text-gray-800'
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}
</script>
