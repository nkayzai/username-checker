<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Username Checker</h1>
              <p class="text-sm text-gray-600">Check availability across multiple platforms</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="results.length > 0"
              @click="downloadResults"
              class="btn-secondary flex items-center space-x-2"
            >
              <Download class="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              v-if="results.length > 0"
              @click="clearResults"
              class="btn-secondary flex items-center space-x-2"
            >
              <X class="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Section -->
      <div class="card mb-8">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Check Username Availability</h2>
          <p class="text-gray-600">Enter a username to check its availability across multiple social media and website platforms</p>
        </div>
        
        <UsernameForm 
          @check-username="handleCheckUsername"
          :loading="loading"
          :error="error"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card mb-8">
        <LoadingIndicator :progress="progress" :current-site="currentSite" />
      </div>

      <!-- Results Section -->
      <div v-if="results.length > 0 && !loading" class="space-y-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <span class="text-xl font-bold text-blue-600">{{ results.length }}</span>
              </div>
              <div class="text-lg font-bold text-gray-900 mb-1">Total Sites</div>
              <div class="text-sm text-gray-600">Platforms checked</div>
            </div>
          </div>
          
          <div class="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle class="w-6 h-6 text-green-600" />
              </div>
              <div class="text-2xl font-bold text-green-600 mb-1">{{ stats.available }}</div>
              <div class="text-sm text-gray-600">Available</div>
            </div>
          </div>
          
          <div class="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <XCircle class="w-6 h-6 text-red-600" />
              </div>
              <div class="text-2xl font-bold text-red-600 mb-1">{{ stats.taken }}</div>
              <div class="text-sm text-gray-600">Taken</div>
            </div>
          </div>
          
          <div class="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <HelpCircle class="w-6 h-6 text-yellow-600" />
              </div>
              <div class="text-2xl font-bold text-yellow-600 mb-1">{{ stats.unknown }}</div>
              <div class="text-sm text-gray-600">Unknown</div>
            </div>
          </div>
        </div>

        <!-- Results by Status -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Available -->
          <div v-if="availableResults.length > 0" class="space-y-6">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 class="text-xl font-bold text-green-800 flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle class="w-5 h-5 text-white" />
                </div>
                <span>Available Usernames</span>
              </h3>
              <p class="text-green-700 text-sm">{{ availableResults.length }} platform{{ availableResults.length !== 1 ? 's' : '' }} available</p>
            </div>
            <div class="space-y-4">
              <ResultCard
                v-for="(result, index) in availableResults"
                :key="result.site"
                :result="result"
                class="fade-in-up"
                :style="{ animationDelay: `${index * 100}ms` }"
              />
            </div>
          </div>

          <!-- Taken -->
          <div v-if="takenResults.length > 0" class="space-y-6">
            <div class="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
              <h3 class="text-xl font-bold text-red-800 flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle class="w-5 h-5 text-white" />
                </div>
                <span>Taken Usernames</span>
              </h3>
              <p class="text-red-700 text-sm">{{ takenResults.length }} platform{{ takenResults.length !== 1 ? 's' : '' }} taken</p>
            </div>
            <div class="space-y-4">
              <ResultCard
                v-for="(result, index) in takenResults"
                :key="result.site"
                :result="result"
                class="fade-in-up"
                :style="{ animationDelay: `${index * 100}ms` }"
              />
            </div>
          </div>

          <!-- Unknown -->
          <div v-if="unknownResults.length > 0" class="space-y-6">
            <div class="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
              <h3 class="text-xl font-bold text-yellow-800 flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <HelpCircle class="w-5 h-5 text-white" />
                </div>
                <span>Unknown Status</span>
              </h3>
              <p class="text-yellow-700 text-sm">{{ unknownResults.length }} platform{{ unknownResults.length !== 1 ? 's' : '' }} unknown</p>
            </div>
            <div class="space-y-4">
              <ResultCard
                v-for="(result, index) in unknownResults"
                :key="result.site"
                :result="result"
                class="fade-in-up"
                :style="{ animationDelay: `${index * 100}ms` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="results.length === 0 && !loading" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Ready to Check Usernames</h3>
        <p class="text-gray-600">Enter a username above to see its availability across multiple platforms</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 Username Checker. Built with Vue.js 3 and Node.js</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Download, X, CheckCircle, XCircle, HelpCircle } from 'lucide-vue-next'
import UsernameForm from './components/UsernameForm.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
import ResultCard from './components/ResultCard.vue'
import { useUsernameChecker } from './composables/useUsernameChecker'

// Composables
const { 
  results, 
  loading, 
  error, 
  progress, 
  currentSite,
  checkUsername,
  clearResults: clearCheckerResults 
} = useUsernameChecker()

// Computed properties
const stats = computed(() => ({
  available: results.value.filter(r => r.status === 'available').length,
  taken: results.value.filter(r => r.status === 'taken').length,
  unknown: results.value.filter(r => r.status === 'unknown').length
}))

const availableResults = computed(() => 
  results.value.filter(r => r.status === 'available')
)

const takenResults = computed(() => 
  results.value.filter(r => r.status === 'taken')
)

const unknownResults = computed(() => 
  results.value.filter(r => r.status === 'unknown')
)

// Methods
const handleCheckUsername = async (username) => {
  await checkUsername(username)
}

const clearResults = () => {
  clearCheckerResults()
}

const downloadResults = () => {
  if (results.value.length === 0) return
  
  const data = {
    username: (results.value[0] && results.value[0].username) || 'unknown',
    timestamp: new Date().toISOString(),
    results: results.value,
    stats: stats.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `username-check-${data.username}-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  // Any initialization logic
})
</script>
