<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6">
          <i class="pi pi-heart text-white text-2xl"></i>
        </div>
        <h2 class="text-4xl font-bold text-white mb-2">Welcome Back</h2>
        <p class="text-white/70 text-lg">Sign in to your Vibe account</p>
      </div>

      <!-- Enhanced Form Card -->
      <div class="p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
        <form @submit.prevent="handleSignIn" class="space-y-6">
          <!-- Username/Email Field with detection -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm">Username or Email</label>
            <div class="relative">
              <input
                v-model="formData.identifier"
                type="text"
                placeholder="Enter your username or email"
                autocomplete="username"
                required
                aria-describedby="identifier-error"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 pl-12 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.identifier, 'border-green-500': isValidIdentifier }"
                @input="validateIdentifier"
                @keydown.enter="focusPassword"
              />
              <!-- Input type indicator -->
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                <i 
                  v-if="identifierType === 'email'" 
                  class="pi pi-envelope text-white/50"
                ></i>
                <i 
                  v-else-if="identifierType === 'username'" 
                  class="pi pi-user text-white/50"
                ></i>
                <i 
                  v-else
                  class="pi pi-question text-white/30"
                ></i>
              </div>
              <!-- Validation indicator -->
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <i 
                  v-if="isValidIdentifier" 
                  class="pi pi-check text-green-500"
                ></i>
                <i 
                  v-else-if="errors.identifier" 
                  class="pi pi-times text-red-500"
                ></i>
              </div>
            </div>
            <p v-if="errors.identifier" id="identifier-error" class="text-red-400 text-sm" role="alert">{{ errors.identifier }}</p>
            <p v-else-if="identifierType && formData.identifier" class="text-white/60 text-sm">
              {{ identifierType === 'email' ? 'Detected email address' : 'Detected username' }}
            </p>
          </div>

          <!-- Password Field with strength checking -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-white font-semibold text-sm">Password</label>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="text-pink-400 hover:text-pink-300 text-sm underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div class="relative">
              <input
                ref="passwordInput"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                aria-describedby="password-error"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 pl-12 pr-12 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.password }"
                @input="validatePassword"
              />
              <!-- Password icon -->
              <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"></i>
              <!-- Show/Hide password button -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <p v-if="errors.password" id="password-error" class="text-red-400 text-sm" role="alert">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Additional Options -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <input
                id="remember"
                v-model="formData.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-pink-500 bg-white/10 border-white/20 rounded focus:ring-pink-500"
              />
              <label for="remember" class="text-white/80 text-sm">Remember me</label>
            </div>
            <div class="flex items-center space-x-1">
              <i class="pi pi-shield text-green-500 text-xs"></i>
              <span class="text-green-400 text-xs">Secure</span>
            </div>
          </div>

          <!-- Submit Button with loading state -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            :aria-busy="isLoading"
            class="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white text-lg py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden focus:ring-2 focus:ring-pink-500/50 focus:outline-none"
          >
            <span v-if="!isLoading">Sign In</span>
            <div v-else class="flex items-center justify-center space-x-2">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Signing In...</span>
            </div>
          </button>

          <!-- API Error Display -->
          <div v-if="apiError" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl" role="alert" aria-live="polite">
            <div class="flex items-center space-x-2">
              <i class="pi pi-exclamation-triangle text-red-400" aria-hidden="true"></i>
              <p class="text-red-200 text-sm">{{ apiError }}</p>
            </div>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-white/70">
            Don't have an account? 
            <router-link to="/signup" class="text-pink-400 hover:text-pink-300 font-semibold underline">
              Sign up here
            </router-link>
          </p>
        </div>

        <!-- Security Notice -->
        <div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div class="flex items-center space-x-2">
            <i class="pi pi-info-circle text-blue-400"></i>
            <p class="text-blue-200 text-xs">
              Your connection is secure and encrypted. We never store your password in plain text.
            </p>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 max-w-sm mx-4">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i class="pi pi-check text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">Welcome Back!</h3>
          <p class="text-white/70 mb-4">You have successfully signed in to your account.</p>
          <button
            @click="redirectToDashboard"
            class="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>

      <!-- Failed Attempts Warning -->
      <div v-if="failedAttempts >= 3" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <div class="flex items-center space-x-2">
          <i class="pi pi-exclamation-triangle text-red-400"></i>
          <div>
            <p class="text-red-200 text-sm font-semibold">Multiple failed attempts detected</p>
            <p class="text-red-300/70 text-xs">
              For security, your account may be temporarily locked after {{ 5 - failedAttempts }} more failed attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type LoginRequest } from '../services/auth'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { setUser } = useAuth()

// Template refs
const passwordInput = ref<HTMLInputElement>()

// Form data
const formData = ref({
  identifier: '',
  password: '',
  rememberMe: false
})

// Form state
const showPassword = ref(false)
const isLoading = ref(false)
const showSuccess = ref(false)
const showForgotPassword = ref(false)
const failedAttempts = ref(0)
const apiError = ref('')

// Validation states
const identifierType = ref<'email' | 'username' | null>(null)
const isValidIdentifier = ref(false)

// Errors
const errors = ref({
  identifier: '',
  password: ''
})

// Identifier validation
const validateIdentifier = () => {
  const identifier = formData.value.identifier.trim()
  
  if (!identifier) {
    identifierType.value = null
    isValidIdentifier.value = false
    errors.value.identifier = ''
    return
  }

  // Email detection
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(identifier)) {
    identifierType.value = 'email'
    isValidIdentifier.value = true
    errors.value.identifier = ''
    return
  }

  // Username detection (3+ chars, alphanumeric + underscore)
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
  if (usernameRegex.test(identifier)) {
    identifierType.value = 'username'
    isValidIdentifier.value = true
    errors.value.identifier = ''
    return
  }

  // Invalid format
  identifierType.value = null
  isValidIdentifier.value = false
  errors.value.identifier = 'Please enter a valid email address or username'
}

// Password validation
const validatePassword = () => {
  const password = formData.value.password
  
  if (!password) {
    errors.value.password = ''
    return
  }

  if (password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return
  }

  errors.value.password = ''
}

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.identifier &&
    formData.value.password &&
    isValidIdentifier.value &&
    !errors.value.identifier &&
    !errors.value.password
  )
})

// Watchers
watch(() => formData.value.identifier, validateIdentifier)
watch(() => formData.value.password, validatePassword)

// Utility functions
const focusPassword = () => {
  passwordInput.value?.focus()
}

// Handle form submission
const handleSignIn = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  apiError.value = ''

  try {
    const loginData: LoginRequest = {
      identifier: formData.value.identifier.trim(),
      password: formData.value.password
    }

    const response = await authService.login(loginData)
    
    console.log('Login successful:', response)
    
    // Convert the auth service user to the format expected by useAuth
    const userForAuth = {
      _id: response.user._id,
      username: response.user.username,
      email: response.user.email || '', // Provide empty string if email is undefined
      profilePicture: response.user.profilePicture
    }
    
    // Set user in global state with access token and storage preference
    setUser(userForAuth, response.accessToken, formData.value.rememberMe)
    
    // Store refresh token with the same storage preference
    if (response.refreshToken) {
      const storage = formData.value.rememberMe ? localStorage : sessionStorage
      storage.setItem('refresh_token', response.refreshToken)
      
      // Clear from the other storage to avoid conflicts
      const otherStorage = formData.value.rememberMe ? sessionStorage : localStorage
      otherStorage.removeItem('refresh_token')
    }
    
    // Reset failed attempts on success
    failedAttempts.value = 0
    
    // Redirect immediately to home page instead of showing success modal
    redirectToDashboard()
    
  } catch (error: any) {
    console.error('Sign in error:', error)
    failedAttempts.value++
    
    // Handle specific error types
    let errorMessage = 'An unexpected error occurred. Please try again.'
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid username/email or password. Please check your credentials.'
    } else if (error.response?.status === 403) {
      errorMessage = 'Your account has been suspended. Please contact support.'
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many login attempts. Please wait a moment before trying again.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    if (failedAttempts.value >= 5) {
      errorMessage = 'Account temporarily locked due to multiple failed attempts. Please wait 15 minutes or reset your password.'
    }
    
    apiError.value = errorMessage
  } finally {
    isLoading.value = false
  }
}

const redirectToDashboard = () => {
  showSuccess.value = false
  
  // Check if there's a redirect URL in the query params
  const returnTo = router.currentRoute.value.query.returnTo as string
  
  if (returnTo && returnTo.startsWith('/')) {
    // Ensure the returnTo is a valid internal route
    router.push(returnTo)
  } else {
    router.push('/home') // Redirect to /home instead of /
  }
}
</script>

<style scoped>
/* Custom checkbox styles */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6 9.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}
</style>