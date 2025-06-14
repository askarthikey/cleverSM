<template>
  <!-- Enhanced Glassmorphism navbar -->
  <nav class="relative z-20 backdrop-blur-xl bg-white/8 border-b border-white/15 shadow-lg">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <div class="flex justify-between items-center h-20">
        <!-- Enhanced Logo and Title -->
        <button @click="goToHome" class="flex items-center space-x-4 cursor-pointer group transition-transform duration-300 hover:scale-105">
          <div class="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50 transition-shadow duration-300">
            <i class="pi pi-heart text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
          </div>
          <span class="text-white font-bold text-3xl tracking-tight group-hover:text-pink-300 transition-colors duration-300">Vibe</span>
        </button>
        
        <!-- Navigation Links - Only show when signed in -->
        <div v-if="isAuthenticated" class="hidden md:flex items-center space-x-10">
          <router-link 
            to="/home" 
            class="text-white/80 hover:text-white font-medium text-lg transition-all duration-300 hover:scale-105 relative group"
          >
            Home
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
          </router-link>
          <router-link 
            to="/connect" 
            class="text-white/80 hover:text-white font-medium text-lg transition-all duration-300 hover:scale-105 relative group"
          >
            Connect
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
          </router-link>
          <router-link 
            to="/create" 
            class="text-white/80 hover:text-white font-medium text-lg transition-all duration-300 hover:scale-105 relative group"
          >
            Create
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
          </router-link>
        </div>

        <!-- Enhanced Auth Buttons -->
        <div class="flex items-center space-x-5">
          <template v-if="!isAuthenticated">
            <!-- Not signed in - enhanced buttons -->
            <Button 
              label="Sign In" 
              class="p-button-text text-white border-2 border-white/30 hover:bg-white/15 hover:border-white/50 font-semibold text-lg px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
              outlined
              @click="() => $router.push('/signin')"
            />
            <Button 
              label="Join Now" 
              class="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 border-0 hover:shadow-xl hover:shadow-pink-500/40 font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              @click="() => $router.push('/signup')"
            />
          </template>
          
          <template v-else>
            <!-- Signed in - show user menu -->
            <div class="flex items-center space-x-4">
              <!-- Notifications Bell -->
              <div class="relative" ref="notificationMenuRef">
                <button
                  @click="toggleNotifications"
                  class="relative p-button-text text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                >
                  <i class="pi pi-bell text-lg"></i>
                  <span 
                    v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold"
                  >
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                  </span>
                </button>
                
                <!-- Notifications Dropdown -->
                <div 
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  <div class="p-4 border-b border-white/20 flex justify-between items-center">
                    <h3 class="text-white font-semibold">Notifications</h3>
                    <button
                      v-if="unreadCount > 0"
                      @click="markAllAsRead"
                      class="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div v-if="loadingNotifications" class="p-4 text-center">
                    <i class="pi pi-spinner pi-spin text-white/50"></i>
                    <p class="text-white/50 text-sm mt-2">Loading notifications...</p>
                  </div>
                  
                  <div v-else-if="notifications.length === 0" class="p-4 text-center">
                    <i class="pi pi-bell text-white/30 text-2xl"></i>
                    <p class="text-white/50 text-sm mt-2">No notifications yet</p>
                  </div>
                  
                  <div v-else class="max-h-64 overflow-y-auto">
                    <div
                      v-for="notification in notifications"
                      :key="notification._id"
                      class="p-3 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                      :class="{ 'bg-white/5': !notification.isRead }"
                      @click="handleNotificationClick(notification)"
                    >
                      <div class="flex items-start space-x-3">
                        <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span class="text-white text-sm font-bold">
                            {{ notification.senderUsername?.charAt(0).toUpperCase() || 'N' }}
                          </span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-white text-sm" :class="{ 'font-semibold': !notification.isRead }">
                            {{ notification.message }}
                          </p>
                          <p class="text-white/50 text-xs mt-1">
                            {{ formatTimeAgo(notification.createdAt) }}
                          </p>
                          
                          <!-- Follow Request Actions -->
                          <div 
                            v-if="notification.type === 'follow_request' && notification.data?.followRequestId"
                            class="flex space-x-2 mt-2"
                          >
                            <button
                              @click.stop="acceptFollowRequest(notification.data.followRequestId!)"
                              class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-full transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              @click.stop="rejectFollowRequest(notification.data.followRequestId!)"
                              class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                        <div v-if="!notification.isRead" class="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                icon="pi pi-envelope" 
                class="p-button-text text-white hover:bg-white/10"
                rounded
                @click="openGmail"
                title="Contact Support"
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
import { notificationService, type Notification } from '../services/notifications'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

// User menu state
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// Notifications state
const showNotifications = ref(false)
const notificationMenuRef = ref<HTMLElement>()
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const loadingNotifications = ref(false)

// Load notifications when component mounts
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  if (isAuthenticated.value) {
    await loadNotifications()
    await loadUnreadCount()
    
    // Poll for new notifications every 30 seconds
    setInterval(async () => {
      if (isAuthenticated.value) {
        await loadUnreadCount()
      }
    }, 30000)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Click outside handler function
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
  if (notificationMenuRef.value && !notificationMenuRef.value.contains(event.target as Node)) {
    showNotifications.value = false
  }
}

// Notification functions
const loadNotifications = async () => {
  try {
    loadingNotifications.value = true
    notifications.value = await notificationService.getNotifications()
  } catch (error) {
    console.error('Failed to load notifications:', error)
  } finally {
    loadingNotifications.value = false
  }
}

const loadUnreadCount = async () => {
  try {
    unreadCount.value = await notificationService.getUnreadCount()
  } catch (error) {
    console.error('Failed to load unread count:', error)
  }
}

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    await loadNotifications()
  }
}

const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead()
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
    unreadCount.value = 0
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.isRead) {
    try {
      await notificationService.markAsRead(notification._id)
      notification.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
}

const acceptFollowRequest = async (requestId: string) => {
  try {
    await notificationService.acceptFollowRequest(requestId)
    // Remove the notification or update its status
    await loadNotifications()
    await loadUnreadCount()
  } catch (error) {
    console.error('Failed to accept follow request:', error)
  }
}

const rejectFollowRequest = async (requestId: string) => {
  try {
    await notificationService.rejectFollowRequest(requestId)
    // Remove the notification or update its status
    await loadNotifications()
    await loadUnreadCount()
  } catch (error) {
    console.error('Failed to reject follow request:', error)
  }
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

// User menu functions
const openGmail = () => {
  const recipient = 'askarthikey01@gmail.com'
  const subject = 'Contact from Vibe Social Media'
  const body = 'Hi there!%0D%0A%0D%0AI am reaching out from the Vibe social media platform.%0D%0A%0D%0A'
  
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}&body=${body}`
  
  // Open Gmail in a new tab
  window.open(gmailUrl, '_blank')
}

const goToHome = () => {
  if (isAuthenticated.value) {
    router.push('/home')
  } else {
    router.push('/')
  }
}

const goToProfile = () => {
  showUserMenu.value = false
  // Navigate to current user's profile
  router.push(`/profile/${user.value?._id}`)
}

const goToSettings = () => {
  showUserMenu.value = false
  router.push('/settings')
}

const handleLogout = () => {
  showUserMenu.value = false
  logout()
  router.push('/') // This will show StartPage for non-authenticated users
}
</script>