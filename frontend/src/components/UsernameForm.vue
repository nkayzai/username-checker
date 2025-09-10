<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="relative">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <div class="relative">
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter username to check..."
            class="input-field pr-12"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': error }"
            :disabled="loading"
            maxlength="30"
            autocomplete="off"
            spellcheck="false"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <AtSign class="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div v-if="error" class="mt-2 text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle class="w-4 h-4" />
          <span>{{ error }}</span>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          {{ username.length }}/30 characters
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          :disabled="!isValidUsername || loading"
          class="btn-primary flex-1 flex items-center justify-center space-x-2"
          :class="{ 'opacity-50 cursor-not-allowed': !isValidUsername || loading }"
        >
          <Search v-if="!loading" class="w-5 h-5" />
          <div v-else class="spinner"></div>
          <span>{{ loading ? 'Checking...' : 'Check Availability' }}</span>
        </button>
        
        <button
          type="button"
          @click="clearForm"
          :disabled="loading"
          class="btn-secondary flex items-center justify-center space-x-2"
        >
          <X class="w-5 h-5" />
          <span>Clear</span>
        </button>
      </div>
    </form>

    <!-- Username Requirements -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 class="text-sm font-medium text-blue-900 mb-2">Username Requirements:</h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li class="flex items-center space-x-2">
          <Check class="w-4 h-4 text-blue-600" />
          <span>2-30 characters long</span>
        </li>
        <li class="flex items-center space-x-2">
          <Check class="w-4 h-4 text-blue-600" />
          <span>Letters, numbers, underscores, and hyphens only</span>
        </li>
        <li class="flex items-center space-x-2">
          <Check class="w-4 h-4 text-blue-600" />
          <span>No spaces or special characters</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, X, AtSign, AlertCircle, Check } from 'lucide-vue-next'

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['check-username'])

// Reactive data
const username = ref('')

// Computed properties
const isValidUsername = computed(() => {
  if (!username.value.trim()) return false
  
  const trimmed = username.value.trim()
  if (trimmed.length < 2 || trimmed.length > 30) return false
  
  // Check for valid characters (alphanumeric, underscore, hyphen)
  const validPattern = /^[a-zA-Z0-9_-]+$/
  return validPattern.test(trimmed)
})

// Methods
const handleSubmit = () => {
  if (!isValidUsername.value || props.loading) return
  
  const trimmedUsername = username.value.trim()
  emit('check-username', trimmedUsername)
}

const clearForm = () => {
  username.value = ''
}

// Auto-focus on mount
import { onMounted } from 'vue'
onMounted(() => {
  const input = document.getElementById('username')
  if (input) {
    input.focus()
  }
})
</script>
