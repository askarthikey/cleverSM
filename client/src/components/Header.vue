<template>
  <!-- Glassmorphism navbar -->
  <nav class="relative z-10 backdrop-blur-lg bg-white/10 border-b border-white/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Title -->
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl flex items-center justify-center">
            <i class="pi pi-heart text-white text-xl"></i>
          </div>
          <span class="text-white font-bold text-2xl">Vibe</span>
        </router-link>
        
        <!-- Navigation Links - Only show when signed in -->
        <div v-if="isAuthenticated" class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-white/80 hover:text-white transition-colors">Home</router-link>
          <router-link to="/explore" class="text-white/80 hover:text-white transition-colors">Explore</router-link>
          <router-link to="/create" class="text-white/80 hover:text-white transition-colors">Create</router-link>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="!isAuthenticated">
            <!-- Not signed in - show Sign In and Join Now -->
            <Button 
              label="Sign In" 
              class="p-button-text text-white border-white/30 hover:bg-white/10"
              outlined
              @click="() => $router.push('/signin')"
            />
            <Button 
              label="Join Now" 
              class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 hover:shadow-lg hover:shadow-pink-500/25"
              @click="() => $router.push('/signup')"
            />
          </template>
          
          <template v-else>
            <!-- Signed in - show user menu -->
            <div class="flex items-center space-x-4">
              <Button 
                icon="pi pi-bell" 
                class="p-button-text text-white hover:bg-white/10"
                rounded
              />
              <Button 
                icon="pi pi-envelope" 
                class="p-button-text text-white hover:bg-white/10"
                rounded
              />
              <div class="relative" ref="userMenuRef">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">
                      {{ user?.username?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <span class="text-white text-sm">{{ user?.username }}</span>
                  <i class="pi pi-chevron-down text-white/50 text-xs"></i>
                </button>
                
                <!-- User Dropdown Menu -->
                <div 
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg z-50"
                >
                  <div class="p-2">
                    <button
                      @click="goToProfile"
                      class="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <i class="pi pi-user"></i>
                      <span>Profile</span>
                    </button>
                    <button
                      @click="goToSettings"
                      class="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <i class="pi pi-cog"></i>
                      <span>Settings</span>
                    </button>
                    <hr class="border-white/20 my-2">
                    <button
                      @click="handleLogout"
                      class="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <i class="pi pi-sign-out"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// Click outside handler function
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const goToProfile = () => {
  showUserMenu.value = false
  router.push(`/profile/${user.value?.username}`)
}

const goToSettings = () => {
  showUserMenu.value = false
  router.push('/settings')
}

const handleLogout = () => {
  showUserMenu.value = false
  logout()
  router.push('/')
}
</script>