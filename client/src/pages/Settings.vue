<template>
  <div class="min-h-screen pb-20">
    <!-- Toast Notification -->
    <Transition name="toast" appear>
      <div 
        v-if="toast.visible"
        clas            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4">
              <Button
                type="button"
                label="Cancel"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-2 rounded-xl"
                outlined
                @click="resetPasswordForm"
              />
              <Button
                type="button"
                label="Change Password"
                icon="pi pi-save"
                class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-pink-500/30"
                :disabled="!isPasswordFormValid"
                @click="showChangePasswordComingSoon"
              />
            </div>
            
            <!-- Implementation Status Message -->
            <div class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div class="flex items-center space-x-3">
                <i class="pi pi-info-circle text-yellow-400"></i>
                <div>
                  <p class="text-yellow-400 font-medium text-sm">Feature Under Development</p>
                  <p class="text-yellow-300/80 text-xs mt-1">Password change functionality is yet to be implemented. This feature is coming soon!</p>
                </div>
              </div>
            </div>ht-4 z-50 max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-lg"
        :class="{
          'border-green-500/50 bg-green-500/10': toast.type === 'success',
          'border-red-500/50 bg-red-500/10': toast.type === 'error',
          'border-blue-500/50 bg-blue-500/10': toast.type === 'info'
        }"
      >
        <div class="flex items-center space-x-3">
          <i 
            class="text-lg"
            :class="{
              'pi pi-check-circle text-green-400': toast.type === 'success',
              'pi pi-times-circle text-red-400': toast.type === 'error',
              'pi pi-info-circle text-blue-400': toast.type === 'info'
            }"
          ></i>
          <span class="text-white font-medium">{{ toast.message }}</span>
          <button
            @click="toast.visible = false"
            class="ml-auto text-white/50 hover:text-white/80 transition-colors"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="relative">
      <!-- Background -->
      <div class="h-48 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <!-- Decorative elements -->
        <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <!-- Header Content -->
      <div class="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="relative -mt-16 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full text-white text-2xl font-bold shadow-2xl border-4 border-white/20 backdrop-blur-sm mb-6">
            <i class="pi pi-cog"></i>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Settings</h1>
          <p class="text-white/80">Manage your account preferences</p>
        </div>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 mt-12">
      <!-- Settings Sections -->
      <div class="space-y-8">
        <!-- Change Password Section -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <div class="flex items-center space-x-3 mb-6">
            <i class="pi pi-lock text-white text-xl"></i>
            <h2 class="text-xl font-semibold text-white">Change Password</h2>
          </div>
          
          <form @submit.prevent="showChangePasswordComingSoon" class="space-y-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-white/80 text-sm font-medium mb-2">
                Current Password
              </label>
              <div class="relative">
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-white/80 text-sm font-medium mb-2">
                New Password
              </label>
              <div class="relative">
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
              <!-- Password strength indicator -->
              <div class="mt-2">
                <div class="flex space-x-1 mb-1">
                  <div 
                    v-for="i in 4" 
                    :key="i"
                    class="h-1 flex-1 rounded-full"
                    :class="getPasswordStrengthColor(i)"
                  ></div>
                </div>
                <p class="text-xs text-white/60">{{ passwordStrengthText }}</p>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label for="confirmPassword" class="block text-white/80 text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
                  :class="{ 'border-red-500/50': passwordForm.confirmPassword && !passwordsMatch }"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
              <p v-if="passwordForm.confirmPassword && !passwordsMatch" class="text-red-400 text-xs mt-1">
                Passwords do not match
              </p>
            </div>

            <!-- Forgot Password Link -->
            <div class="text-center">
              <button
                type="button"
                @click="showForgotPassword"
                class="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Forgot your current password?
              </button>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <Button
                type="button"
                label="Cancel"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-2 rounded-xl"
                outlined
                @click="resetPasswordForm"
              />
              <Button
                type="button"
                label="Change Password"
                icon="pi pi-save"
                class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-pink-500/30"
                :disabled="!isPasswordFormValid"
                @click="showChangePasswordComingSoon"
              />
            </div>
            
            <!-- Implementation Status Message -->
            <div class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div class="flex items-center space-x-3">
                <i class="pi pi-info-circle text-yellow-400"></i>
                <div>
                  <p class="text-yellow-400 font-medium text-sm">Feature Under Development</p>
                  <p class="text-yellow-300/80 text-xs mt-1">Password change functionality is yet to be implemented. This feature is coming soon!</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Account Section -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 opacity-50">
          <div class="flex items-center space-x-3 mb-6">
            <i class="pi pi-user text-white text-xl"></i>
            <h2 class="text-xl font-semibold text-white">Account Settings</h2>
          </div>
          <div class="text-center py-6">
            <i class="pi pi-clock text-white/40 text-4xl mb-4"></i>
            <p class="text-white/60 text-lg font-medium mb-2">Feature Coming Soon</p>
            <p class="text-white/40 text-sm">Edit profile, privacy settings, and more will be available soon.</p>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 opacity-50">
          <div class="flex items-center space-x-3 mb-6">
            <i class="pi pi-bell text-white text-xl"></i>
            <h2 class="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div class="text-center py-6">
            <i class="pi pi-clock text-white/40 text-4xl mb-4"></i>
            <p class="text-white/60 text-lg font-medium mb-2">Feature Coming Soon</p>
            <p class="text-white/40 text-sm">Manage your notification preferences and settings.</p>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 opacity-50">
          <div class="flex items-center space-x-3 mb-6">
            <i class="pi pi-shield text-white text-xl"></i>
            <h2 class="text-xl font-semibold text-white">Security</h2>
          </div>
          <div class="text-center py-6">
            <i class="pi pi-clock text-white/40 text-4xl mb-4"></i>
            <p class="text-white/60 text-lg font-medium mb-2">Feature Coming Soon</p>
            <p class="text-white/40 text-sm">Two-factor authentication, login history, and security settings.</p>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 opacity-50">
          <div class="flex items-center space-x-3 mb-6">
            <i class="pi pi-eye-slash text-white text-xl"></i>
            <h2 class="text-xl font-semibold text-white">Privacy</h2>
          </div>
          <div class="text-center py-6">
            <i class="pi pi-clock text-white/40 text-4xl mb-4"></i>
            <p class="text-white/60 text-lg font-medium mb-2">Feature Coming Soon</p>
            <p class="text-white/40 text-sm">Control who can see your content and contact you.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'

// State
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Toast notification
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
})

// Computed properties
const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'Enter password'
  if (strength === 1) return 'Weak'
  if (strength === 2) return 'Fair'
  if (strength === 3) return 'Good'
  return 'Strong'
})

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordsMatch.value &&
         passwordForm.value.newPassword.length >= 8
})

// Methods
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = { message, type, visible: true }
  const timeout = type === 'success' ? 5000 : 3000
  setTimeout(() => {
    toast.value.visible = false
  }, timeout)
}

const getPasswordStrengthColor = (index: number) => {
  const strength = passwordStrength.value
  if (index <= strength) {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-yellow-500'
    if (strength <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-white/20'
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

const showForgotPassword = () => {
  showToast('Forgot Password feature coming soon! Please contact support for assistance.', 'info')
}

const showChangePasswordComingSoon = () => {
  showToast('Change Password feature coming soon! Please contact support for assistance.', 'info')
}
</script>

<style scoped>
/* Toast transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Form input animations */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

/* Password strength animation */
.bg-red-500,
.bg-yellow-500,
.bg-blue-500,
.bg-green-500 {
  transition: all 0.3s ease;
}
</style>
