<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6">
          <i class="pi pi-heart text-white text-2xl"></i>
        </div>
        <h2 class="text-4xl font-bold text-white mb-2">Join Vibe</h2>
        <p class="text-white/70 text-lg">Create your account and start connecting</p>
      </div>

      <!-- Enhanced Form Card -->
      <div class="p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
        <form @submit.prevent="handleSignUp" class="space-y-6">
          <!-- Username Field with validation -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm">Username</label>
            <div class="relative">
              <input
                v-model="formData.username"
                type="text"
                placeholder="Choose a unique username"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.username, 'border-green-500': isUsernameValid }"
                @input="debounceUsernameCheck"
              />
              <i 
                v-if="isCheckingUsername" 
                class="pi pi-spin pi-spinner absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
              ></i>
              <i 
                v-else-if="isUsernameValid" 
                class="pi pi-check absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
              ></i>
              <i 
                v-else-if="errors.username" 
                class="pi pi-times absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
              ></i>
            </div>
            <p v-if="errors.username" class="text-red-400 text-sm">{{ errors.username }}</p>
            <p v-else-if="isUsernameValid" class="text-green-400 text-sm">Username is available!</p>
          </div>

          <!-- Email/Phone Toggle -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-white font-semibold text-sm">Contact Method</label>
              <div class="flex bg-white/10 rounded-lg p-1">
                <button
                  type="button"
                  @click="contactMethod = 'email'"
                  :class="[
                    'px-3 py-1 text-sm rounded-md transition-all',
                    contactMethod === 'email' 
                      ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                      : 'text-white/70 hover:text-white'
                  ]"
                >
                  Email
                </button>
                <button
                  type="button"
                  @click="contactMethod = 'phone'"
                  :class="[
                    'px-3 py-1 text-sm rounded-md transition-all',
                    contactMethod === 'phone' 
                      ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                      : 'text-white/70 hover:text-white'
                  ]"
                >
                  Phone
                </button>
              </div>
            </div>

            <!-- Email/Phone Input -->
            <div>
              <input
                v-if="contactMethod === 'email'"
                v-model="formData.email"
                type="email"
                placeholder="Enter your email address"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.email }"
              />
              <input
                v-else
                v-model="formData.phone"
                type="tel"
                placeholder="Enter your phone number"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.phone }"
              />
              <p v-if="errors.email && contactMethod === 'email'" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
              <p v-if="errors.phone && contactMethod === 'phone'" class="text-red-400 text-sm mt-1">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Password Field with strength indicator -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm">Password</label>
            <div class="relative">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a strong password"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 pr-12 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-400 text-sm">{{ errors.password }}</p>
            
            <!-- Password Strength Indicator -->
            <div v-if="formData.password" class="space-y-2">
              <div class="flex space-x-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="flex-1 h-1 rounded-full transition-colors"
                  :class="getPasswordStrengthColor(i)"
                ></div>
              </div>
              <p class="text-xs" :class="getPasswordStrengthTextColor()">
                {{ getPasswordStrengthText() }}
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm">Confirm Password</label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 focus:border-pink-500 focus:outline-none transition-colors"
              :class="{ 'border-red-500': errors.confirmPassword, 'border-green-500': formData.confirmPassword && formData.password === formData.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-red-400 text-sm">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start space-x-3">
            <input
              id="terms"
              v-model="formData.agreeToTerms"
              type="checkbox"
              class="mt-1 w-4 h-4 text-pink-500 bg-white/10 border-white/20 rounded focus:ring-pink-500"
            />
            <label for="terms" class="text-white/80 text-sm">
              I agree to the 
              <a href="#" class="text-pink-400 hover:text-pink-300 underline">Terms of Service</a> 
              and 
              <a href="#" class="text-pink-400 hover:text-pink-300 underline">Privacy Policy</a>
            </label>
          </div>
          <p v-if="errors.agreeToTerms" class="text-red-400 text-sm">{{ errors.agreeToTerms }}</p>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white text-lg py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <!-- API Error Display -->
          <div v-if="apiError" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div class="flex items-center space-x-2">
              <i class="pi pi-exclamation-triangle text-red-400"></i>
              <p class="text-red-200 text-sm">{{ apiError }}</p>
            </div>
          </div>
        </form>

        <!-- Sign In Link -->
        <div class="mt-6 text-center">
          <p class="text-white/70">
            Already have an account? 
            <router-link to="/signin" class="text-pink-400 hover:text-pink-300 font-semibold underline">
              Sign in here
            </router-link>
          </p>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 max-w-sm mx-4">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <i class="pi pi-check text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">Welcome to Vibe!</h3>
          <p class="text-white/70 mb-4">Your account has been created successfully.</p>
          <button
            @click="redirectToSignIn"
            class="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type RegisterRequest } from '../services/auth'

const router = useRouter()

// Form data
const formData = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

// Form state
const contactMethod = ref<'email' | 'phone'>('email')
const showPassword = ref(false)
const isLoading = ref(false)
const showSuccess = ref(false)
const isCheckingUsername = ref(false)
const isUsernameValid = ref(false)
const apiError = ref('')

// Debounce timer for username checking
let usernameCheckTimer: ReturnType<typeof setTimeout> | null = null

// Errors
const errors = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: ''
})

// Username availability check with debouncing
const debounceUsernameCheck = () => {
  if (usernameCheckTimer) {
    clearTimeout(usernameCheckTimer)
  }
  
  usernameCheckTimer = setTimeout(() => {
    checkUsername()
  }, 500)
}

const checkUsername = async () => {
  const username = formData.value.username.trim()
  
  if (username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
    isUsernameValid.value = false
    return
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.value.username = 'Username can only contain letters, numbers, and underscores'
    isUsernameValid.value = false
    return
  }

  isCheckingUsername.value = true
  errors.value.username = ''

  try {
    const response = await authService.checkUsername(username)
    if (response.available) {
      isUsernameValid.value = true
      errors.value.username = ''
    } else {
      isUsernameValid.value = false
      errors.value.username = 'Username is already taken'
    }
  } catch (error) {
    console.error('Username check failed:', error)
    errors.value.username = 'Unable to check username availability'
    isUsernameValid.value = false
  } finally {
    isCheckingUsername.value = false
  }
}

// Password strength calculation
const passwordStrength = computed(() => {
  const password = formData.value.password
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return strength
})

const getPasswordStrengthColor = (index: number) => {
  const strength = passwordStrength.value
  if (index <= strength) {
    if (strength <= 1) return 'bg-red-500'
    if (strength === 2) return 'bg-yellow-500'
    if (strength === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-white/20'
}

const getPasswordStrengthText = () => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'Weak password'
  if (strength === 2) return 'Fair password'
  if (strength === 3) return 'Good password'
  return 'Strong password'
}

const getPasswordStrengthTextColor = () => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'text-red-400'
  if (strength === 2) return 'text-yellow-400'
  if (strength === 3) return 'text-blue-400'
  return 'text-green-400'
}

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.username &&
    isUsernameValid.value &&
    (contactMethod.value === 'email' ? formData.value.email : formData.value.phone) &&
    formData.value.password &&
    formData.value.password === formData.value.confirmPassword &&
    passwordStrength.value >= 2 &&
    formData.value.agreeToTerms &&
    !Object.values(errors.value).some(error => error)
  )
})

// Watchers for validation
watch(() => formData.value.email, (newEmail) => {
  if (contactMethod.value === 'email' && newEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.value.email = emailRegex.test(newEmail) ? '' : 'Please enter a valid email address'
  }
})

watch(() => formData.value.phone, (newPhone) => {
  if (contactMethod.value === 'phone' && newPhone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    errors.value.phone = phoneRegex.test(newPhone) ? '' : 'Please enter a valid phone number'
  }
})

watch(() => formData.value.password, (newPassword) => {
  if (newPassword) {
    errors.value.password = newPassword.length < 8 ? 'Password must be at least 8 characters' : ''
  }
})

watch(() => formData.value.confirmPassword, (newConfirmPassword) => {
  if (newConfirmPassword) {
    errors.value.confirmPassword = 
      newConfirmPassword !== formData.value.password ? 'Passwords do not match' : ''
  }
})

watch(() => formData.value.agreeToTerms, (agreed) => {
  errors.value.agreeToTerms = agreed ? '' : 'You must agree to the terms and conditions'
})

// Handle form submission
const handleSignUp = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  apiError.value = ''

  try {
    const registerData: RegisterRequest = {
      username: formData.value.username,
      password: formData.value.password
    }

    if (contactMethod.value === 'email') {
      registerData.email = formData.value.email
    } else {
      registerData.phone = formData.value.phone
    }

    const response = await authService.register(registerData)
    
    console.log('Registration successful:', response)
    showSuccess.value = true
    
  } catch (error: any) {
    console.error('Sign up error:', error)
    apiError.value = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const redirectToSignIn = () => {
  showSuccess.value = false
  router.push('/signin')
}
</script>