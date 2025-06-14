<template>
  <div class="min-h-screen">
    <!-- Toast Notification -->
    <Transition name="toast" appear>
      <div 
        v-if="toast.visible"
        class="fixed top-4 right-4 z-50 max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-lg"
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

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Connect with People</h1>
        <p class="text-white/70">Discover new people and manage your connections</p>
      </div>

      <!-- Search and Filter Bar -->
      <div class="mb-8 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
        <div class="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <input 
              v-model="searchQuery"
              placeholder="Search users by username..."
              class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full px-4 py-3 pl-12 pr-12 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all duration-200"
              @keyup.enter="performSearch"
              @keyup.esc="clearSearch"
              @input="handleSearchInput"
            />
            <i 
              :class="isSearching ? 'pi pi-spin pi-spinner' : 'pi pi-search'" 
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
            ></i>
            <button
              v-if="searchQuery.trim()"
              @click="clearSearch"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors hover:scale-110"
              title="Clear search"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- View Toggle -->
          <div class="flex bg-white/10 rounded-full p-1">
            <button
              @click="activeView = 'discover'"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              :class="activeView === 'discover' 
                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10'"
            >
              <i class="pi pi-users mr-2"></i>
              Discover
            </button>
            <button
              @click="activeView = 'following'"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              :class="activeView === 'following' 
                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10'"
            >
              <i class="pi pi-heart mr-2"></i>
              Following
            </button>
          </div>

          <!-- Sort Options -->
          <select 
            v-model="sortBy"
            @change="applySorting"
            class="bg-white/10 border border-white/20 text-white rounded-full px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 appearance-none cursor-pointer"
            style="background-image: url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem;"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="username">Username A-Z</option>
            <option value="username-desc">Username Z-A</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <!-- Follow Requests Section (when in discover mode) -->
        <div v-if="activeView === 'discover' && !isSearchMode" class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-white flex items-center space-x-2">
              <i class="pi pi-user-plus text-pink-400"></i>
              <span>Follow Requests</span>
              <span v-if="pendingFollowRequests.length > 0" class="text-sm bg-pink-500 text-white rounded-full px-2 py-1 min-w-[20px] h-6 flex items-center justify-center">
                {{ pendingFollowRequests.length }}
              </span>
            </h2>
          </div>
          
          <div v-if="loadingFollowRequests" class="animate-pulse">
            <div class="p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 bg-white/20 rounded-full"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-4 bg-white/20 rounded w-1/3"></div>
                  <div class="h-3 bg-white/20 rounded w-1/2"></div>
                </div>
                <div class="flex space-x-2">
                  <div class="h-8 w-16 bg-white/20 rounded"></div>
                  <div class="h-8 w-16 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="pendingFollowRequests.length === 0" class="p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-center">
            <i class="pi pi-check-circle text-green-400 text-2xl mb-2"></i>
            <p class="text-white/70 text-sm">No pending follow requests</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="request in pendingFollowRequests" 
              :key="request._id"
              class="p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">{{ request.senderUsername.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <h3 class="text-white font-medium">{{ request.senderUsername }}</h3>
                    <p class="text-white/50 text-sm">wants to follow you</p>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button
                    @click="acceptFollowRequest(request._id)"
                    :disabled="processingRequests.has(request._id)"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <i :class="processingRequests.has(request._id) ? 'pi pi-spin pi-spinner' : 'pi pi-check'"></i>
                    <span>Accept</span>
                  </button>
                  <button
                    @click="rejectFollowRequest(request._id)"
                    :disabled="processingRequests.has(request._id)"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <i :class="processingRequests.has(request._id) ? 'pi pi-spin pi-spinner' : 'pi pi-times'"></i>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 bg-white/20 rounded-full"></div>
              <div class="space-y-2 flex-1">
                <div class="h-4 bg-white/20 rounded w-1/3"></div>
                <div class="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
              <div class="h-10 w-24 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users List -->
      <div v-else-if="displayedUsers.length > 0" class="space-y-4">
        <!-- Follow Requests Section (when not loading) -->
        <div v-if="activeView === 'discover' && !isSearchMode" class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-white flex items-center space-x-2">
              <i class="pi pi-user-plus text-pink-400"></i>
              <span>Follow Requests</span>
              <span v-if="pendingFollowRequests.length > 0" class="text-sm bg-pink-500 text-white rounded-full px-2 py-1 min-w-[20px] h-6 flex items-center justify-center">
                {{ pendingFollowRequests.length }}
              </span>
            </h2>
          </div>
          
          <div v-if="loadingFollowRequests" class="animate-pulse">
            <div class="p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 bg-white/20 rounded-full"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-4 bg-white/20 rounded w-1/3"></div>
                  <div class="h-3 bg-white/20 rounded w-1/2"></div>
                </div>
                <div class="flex space-x-2">
                  <div class="h-8 w-16 bg-white/20 rounded"></div>
                  <div class="h-8 w-16 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="pendingFollowRequests.length === 0" class="p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-center">
            <i class="pi pi-check-circle text-green-400 text-2xl mb-2"></i>
            <p class="text-white/70 text-sm">No pending follow requests</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="request in pendingFollowRequests" 
              :key="request._id"
              class="p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">{{ request.senderUsername.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <h3 class="text-white font-medium">{{ request.senderUsername }}</h3>
                    <p class="text-white/50 text-sm">wants to follow you</p>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button
                    @click="acceptFollowRequest(request._id)"
                    :disabled="processingRequests.has(request._id)"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <i :class="processingRequests.has(request._id) ? 'pi pi-spin pi-spinner' : 'pi pi-check'"></i>
                    <span>Accept</span>
                  </button>
                  <button
                    @click="rejectFollowRequest(request._id)"
                    :disabled="processingRequests.has(request._id)"
                    class="px-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <i :class="processingRequests.has(request._id) ? 'pi pi-spin pi-spinner' : 'pi pi-times'"></i>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div 
          v-for="user in displayedUsers" 
          :key="user._id"
          class="user-card p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- User Avatar -->
              <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xl font-bold">{{ getUserInitial(user.username) }}</span>
              </div>
              
              <!-- User Info -->
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg font-semibold text-white">{{ user.username }}</h3>
                  <i 
                    v-if="user.isVerified" 
                    class="pi pi-verified text-blue-400" 
                    title="Verified user"
                  ></i>
                </div>
                <p v-if="user.bio" class="text-white/70 text-sm">{{ user.bio }}</p>
                <div class="flex items-center space-x-4 text-white/60 text-xs">
                  <span>{{ user.followers.length }} followers</span>
                  <span>{{ user.following.length }} following</span>
                  <span>Joined {{ formatDate(user.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Follow/Unfollow Button -->
            <div class="flex items-center space-x-3">
              <button
                @click="handleFollowAction(user)"
                :disabled="loadingUsers.has(user._id)"
                class="px-6 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                :class="getFollowButtonClass(user)"
              >
                <i 
                  :class="loadingUsers.has(user._id) 
                    ? 'pi pi-spin pi-spinner' 
                    : getFollowButtonIcon(user)"
                ></i>
                <span>{{ getFollowButtonText(user) }}</span>
              </button>
              
              <!-- View Profile Button -->
              <button
                @click="viewProfile(user)"
                class="px-4 py-2 rounded-full border border-white/30 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                title="View profile"
              >
                <i class="pi pi-user"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreUsers" class="text-center py-6">
          <button 
            @click="loadMoreUsers"
            :disabled="loadingMore"
            class="px-8 py-3 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            <i :class="loadingMore ? 'pi pi-spin pi-spinner' : 'pi pi-chevron-down'"></i>
            <span>{{ loadingMore ? 'Loading...' : 'Load More' }}</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="mb-6">
          <i 
            :class="isSearchMode 
              ? 'pi pi-search text-blue-400' 
              : activeView === 'discover' 
                ? 'pi pi-users text-white/30' 
                : 'pi pi-heart text-pink-400'"
            class="text-6xl mb-4"
          ></i>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">
          {{ getEmptyStateTitle() }}
        </h3>
        <p class="text-white/60 mb-6">
          {{ getEmptyStateMessage() }}
        </p>
        <button 
          v-if="isSearchMode"
          @click="clearSearch"
          class="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200"
        >
          Clear Search
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi, type User, type UsersResponse } from '../services/users'
import { notificationService, type FollowRequest } from '../services/notifications'
import { useAuth } from '../composables/useAuth'

// Router and auth
const router = useRouter()
const { user } = useAuth()

// Reactive state
const loading = ref(false)
const loadingMore = ref(false)
const loadingUsers = ref(new Set<string>())
const users = ref<User[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const activeView = ref<'discover' | 'following'>('discover')
const searchQuery = ref('')
const isSearching = ref(false)
const isSearchMode = ref(false)
const searchTimeout = ref<number | null>(null)
const sortBy = ref('newest')

// Follow requests state
const pendingFollowRequests = ref<FollowRequest[]>([])
const loadingFollowRequests = ref(false)
const processingRequests = ref(new Set<string>())

// Toast notification
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
})

// Computed properties
const hasMoreUsers = computed(() => currentPage.value < totalPages.value)
const displayedUsers = computed(() => {
  let sortedUsers = [...users.value]
  
  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      sortedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      sortedUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'username':
      sortedUsers.sort((a, b) => a.username.localeCompare(b.username))
      break
    case 'username-desc':
      sortedUsers.sort((a, b) => b.username.localeCompare(a.username))
      break
  }
  
  return sortedUsers
})

// Methods
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = { message, type, visible: true }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

const fetchUsers = async (page: number = 1, isLoadMore: boolean = false) => {
  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
      if (!isLoadMore) {
        users.value = []
      }
    }

    let response: UsersResponse

    if (isSearchMode.value && searchQuery.value.trim()) {
      response = await usersApi.searchUsers(searchQuery.value.trim(), page, 20)
    } else if (activeView.value === 'discover') {
      response = await usersApi.getUserSuggestions(page, 20)
    } else {
      response = await usersApi.getFollowing(page, 20)
    }

    if (isLoadMore) {
      users.value.push(...response.users)
    } else {
      users.value = response.users
    }
    
    currentPage.value = response.page
    totalPages.value = response.totalPages

  } catch (err) {
    console.error('Error fetching users:', err)
    showToast('Failed to load users', 'error')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMoreUsers = async () => {
  if (!hasMoreUsers.value || loadingMore.value) return
  await fetchUsers(currentPage.value + 1, true)
}

const handleSearchInput = async () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  const query = searchQuery.value.trim()
  
  if (query) {
    searchTimeout.value = window.setTimeout(() => {
      performSearch()
    }, 300) // Debounce search by 300ms
  } else {
    await resetSearch()
  }
}

const performSearch = async () => {
  const query = searchQuery.value.trim()
  if (!query) {
    resetSearch()
    return
  }

  try {
    isSearching.value = true
    isSearchMode.value = true
    currentPage.value = 1
    
    await fetchUsers(1, false)
    
    if (users.value.length === 0) {
      showToast(`No users found for "${query}"`, 'info')
    } else {
      showToast(`Found ${users.value.length} user${users.value.length !== 1 ? 's' : ''}`, 'success')
    }
  } catch (err) {
    console.error('Search error:', err)
    showToast('Search failed', 'error')
  } finally {
    isSearching.value = false
  }
}

const resetSearch = async () => {
  isSearchMode.value = false
  currentPage.value = 1
  await fetchUsers()
}

const clearSearch = async () => {
  searchQuery.value = ''
  await resetSearch()
  showToast('Search cleared', 'info')
}

const applySorting = () => {
  // Trigger reactivity for computed property
  users.value = [...users.value]
}

// Load follow requests
const loadFollowRequests = async () => {
  try {
    loadingFollowRequests.value = true
    pendingFollowRequests.value = await notificationService.getPendingFollowRequests()
  } catch (err) {
    console.error('Error loading follow requests:', err)
    showToast('Failed to load follow requests', 'error')
  } finally {
    loadingFollowRequests.value = false
  }
}

// Accept follow request
const acceptFollowRequest = async (requestId: string) => {
  if (processingRequests.value.has(requestId)) return
  
  try {
    processingRequests.value.add(requestId)
    await notificationService.acceptFollowRequest(requestId)
    
    // Remove the request from the list
    pendingFollowRequests.value = pendingFollowRequests.value.filter(req => req._id !== requestId)
    showToast('Follow request accepted', 'success')
  } catch (err) {
    console.error('Error accepting follow request:', err)
    showToast('Failed to accept follow request', 'error')
  } finally {
    processingRequests.value.delete(requestId)
  }
}

// Reject follow request
const rejectFollowRequest = async (requestId: string) => {
  if (processingRequests.value.has(requestId)) return
  
  try {
    processingRequests.value.add(requestId)
    await notificationService.rejectFollowRequest(requestId)
    
    // Remove the request from the list
    pendingFollowRequests.value = pendingFollowRequests.value.filter(req => req._id !== requestId)
    showToast('Follow request rejected', 'success')
  } catch (err) {
    console.error('Error rejecting follow request:', err)
    showToast('Failed to reject follow request', 'error')
  } finally {
    processingRequests.value.delete(requestId)
  }
}

// Get follow button class based on user status
const getFollowButtonClass = (targetUser: User) => {
  if (targetUser.isFollowing) {
    return 'bg-white/10 border border-white/30 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300'
  } else if (targetUser.followRequestSent) {
    return 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
  } else {
    return 'bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:shadow-lg hover:shadow-pink-500/25'
  }
}

// Get follow button icon based on user status
const getFollowButtonIcon = (targetUser: User) => {
  if (targetUser.isFollowing) {
    return 'pi pi-user-minus'
  } else if (targetUser.followRequestSent) {
    return 'pi pi-clock'
  } else {
    return 'pi pi-user-plus'
  }
}

// Get follow button text based on user status
const getFollowButtonText = (targetUser: User) => {
  if (targetUser.isFollowing) {
    return 'Unfollow'
  } else if (targetUser.followRequestSent) {
    return 'Pending'
  } else {
    return 'Follow'
  }
}

// Handle follow action (send request, unfollow, or cancel request)
const handleFollowAction = async (targetUser: User) => {
  if (loadingUsers.value.has(targetUser._id)) return
  
  try {
    loadingUsers.value.add(targetUser._id)
    
    if (targetUser.isFollowing) {
      // Unfollow the user
      const response = await usersApi.unfollowUser(targetUser._id)
      targetUser.isFollowing = false
      targetUser.followRequestSent = false
      
      // Update follower count
      const index = targetUser.followers.indexOf(user.value?._id || '')
      if (index > -1) {
        targetUser.followers.splice(index, 1)
      }
      
      showToast(response.message, 'success')
    } else if (targetUser.followRequestSent) {
      // Cancel follow request
      await notificationService.cancelFollowRequest(targetUser._id)
      targetUser.followRequestSent = false
      showToast('Follow request cancelled', 'success')
    } else {
      // Send follow request
      await notificationService.sendFollowRequest(targetUser._id)
      targetUser.followRequestSent = true
      showToast('Follow request sent', 'success')
    }
    
  } catch (err) {
    console.error('Error handling follow action:', err)
    showToast('Failed to update follow status', 'error')
  } finally {
    loadingUsers.value.delete(targetUser._id)
  }
}



const viewProfile = (user: User) => {
  // Navigate to user profile (you can implement this route)
  router.push(`/profile/${user.username}`)
}

const getUserInitial = (username: string) => {
  return username.charAt(0).toUpperCase()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const getEmptyStateTitle = () => {
  if (isSearchMode.value) return 'No search results found'
  if (activeView.value === 'discover') return 'No users to discover'
  return 'Not following anyone yet'
}

const getEmptyStateMessage = () => {
  if (isSearchMode.value) return 'Try searching with different keywords or check your spelling.'
  if (activeView.value === 'discover') return 'All caught up! You\'ve discovered everyone in the community.'
  return 'Start following people to see them here.'
}

// Watchers
watch(activeView, () => {
  currentPage.value = 1
  if (!isSearchMode.value) {
    fetchUsers()
    if (activeView.value === 'discover') {
      loadFollowRequests()
    }
  }
})

// Lifecycle
onMounted(() => {
  fetchUsers()
  loadFollowRequests()
})
</script>

<style scoped>
.user-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

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

/* Custom select styling for better appearance */
select option {
  background-color: #1f2937;
  color: white;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
