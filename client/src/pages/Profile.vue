<template>
  <div class="min-h-screen pb-20">
    <!-- User Not Found -->
    <div v-if="profileNotFound" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <i class="pi pi-user-minus text-white/30 text-6xl mb-4"></i>
        <h2 class="text-white/70 text-2xl font-medium mb-2">User Not Found</h2>
        <p class="text-white/50 mb-6">The user you're looking for doesn't exist or may have been removed.</p>
        <Button 
          label="Go Home" 
          icon="pi pi-home"
          class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 px-8 py-3"
          @click="$router.push('/home')"
        />
      </div>
    </div>

    <!-- Profile Content -->
    <template v-else>
      <!-- Profile Header Section -->
      <div class="relative">
      <!-- Cover Background -->
      <div class="h-64 sm:h-80 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <!-- Decorative elements -->
        <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <!-- Profile Content -->
      <div class="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="relative -mt-20 sm:-mt-24">
          <!-- Profile Picture -->
          <div class="flex flex-col sm:flex-row items-center sm:items-end space-y-6 sm:space-y-0 sm:space-x-8">
            <div class="relative group">
              <div class="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl border-4 border-white/20 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                {{ profileInitial }}
              </div>
              <button class="absolute bottom-2 right-2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg">
                <i class="pi pi-camera text-sm"></i>
              </button>
            </div>

            <!-- Profile Info -->
            <div class="text-center sm:text-left flex-1 space-y-4">
              <div v-if="isLoadingProfile" class="animate-pulse">
                <div class="h-8 bg-white/20 rounded mb-2"></div>
                <div class="h-4 bg-white/20 rounded w-3/4"></div>
              </div>
              <div v-else>
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">{{ displayUser?.username || 'Username' }}</h1>
                <p class="text-white/80 text-lg">{{ displayUser?.email || 'user@example.com' }}</p>
              </div>

              <!-- Stats -->
              <div class="flex justify-center sm:justify-start space-x-8">
                <button 
                  @click="showFollowers = true"
                  class="text-center group hover:scale-105 transition-transform duration-200"
                >
                  <div class="text-2xl font-bold text-white group-hover:text-pink-300">{{ followersCount }}</div>
                  <div class="text-white/70 text-sm font-medium">Followers</div>
                </button>
                <button 
                  @click="showFollowing = true"
                  class="text-center group hover:scale-105 transition-transform duration-200"
                >
                  <div class="text-2xl font-bold text-white group-hover:text-pink-300">{{ followingCount }}</div>
                  <div class="text-white/70 text-sm font-medium">Following</div>
                </button>
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">{{ postsCount }}</div>
                  <div class="text-white/70 text-sm font-medium">Posts</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center sm:justify-start space-x-4 pt-2">
                <!-- Own Profile Actions -->
                <template v-if="isOwnProfile">
                  <Button 
                    label="Edit Profile" 
                    icon="pi pi-user-edit"
                    class="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-medium px-6 py-2 rounded-xl transition-all duration-300"
                    outlined
                    @click="editProfile"
                  />
                  <Button 
                    label="Share Profile" 
                    icon="pi pi-share-alt"
                    class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 font-medium px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                    @click="shareProfile"
                  />
                </template>
                
                <!-- Other User Profile Actions -->
                <template v-else>
                  <button
                    @click="handleFollowAction"
                    :disabled="isLoadingFollow"
                    class="px-6 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    :class="getFollowButtonClasses()"
                  >
                    <i 
                      :class="isLoadingFollow 
                        ? 'pi pi-spin pi-spinner' 
                        : getFollowButtonIcon()"
                    ></i>
                    <span>{{ getFollowButtonText() }}</span>
                  </button>
                  <Button 
                    label="Message" 
                    icon="pi pi-comments"
                    class="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-medium px-6 py-2 rounded-xl transition-all duration-300"
                    outlined
                    @click="messageUser"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-12">
      <!-- Tab Navigation -->
      <div class="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-2xl p-2 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300',
            activeTab === tab.id 
              ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          ]"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="min-h-96">
        <!-- Posts Tab -->
        <div v-if="activeTab === 'posts'" class="space-y-6">
          <div v-if="isLoadingPosts" class="text-center py-12">
            <i class="pi pi-spinner pi-spin text-white/50 text-3xl"></i>
            <p class="text-white/50 mt-4">Loading posts...</p>
          </div>
          
          <div v-else-if="userPosts.length === 0" class="text-center py-20">
            <i class="pi pi-image text-white/30 text-6xl mb-4"></i>
            <h3 class="text-white/70 text-xl font-medium mb-2">
              {{ isOwnProfile ? 'No posts yet' : `${displayUser?.username} hasn't posted yet` }}
            </h3>
            <p class="text-white/50 mb-6">
              {{ isOwnProfile 
                ? 'Share your first moment with the world!' 
                : 'Check back later to see their posts.' 
              }}
            </p>
            <Button 
              v-if="isOwnProfile"
              label="Create Your First Post" 
              icon="pi pi-plus"
              class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 px-8 py-3 text-lg"
              @click="$router.push('/create')"
            />
          </div>

          <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="post in userPosts" 
              :key="post._id"
              class="post-card group cursor-pointer"
              @click="openPost(post)"
            >
              <div class="aspect-square bg-gradient-to-br from-pink-400/20 to-violet-500/20 rounded-2xl p-6 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:scale-105">
                <div class="text-center">
                  <i class="pi pi-file-text text-white/70 text-3xl mb-3"></i>
                  <h4 class="text-white font-semibold text-sm mb-2 line-clamp-2">{{ post.title }}</h4>
                  <p class="text-white/80 font-medium text-xs line-clamp-3 mb-3">{{ post.description }}</p>
                  <div class="flex items-center justify-center space-x-4 text-white/50 text-xs">
                    <span><i class="pi pi-heart mr-1"></i>{{ post.likesCount || 0 }}</span>
                    <span><i class="pi pi-comment mr-1"></i>{{ post.commentsCount || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Tab -->
        <div v-if="activeTab === 'comments'" class="space-y-4">
          <div v-if="isLoadingComments" class="text-center py-12">
            <i class="pi pi-spinner pi-spin text-white/50 text-3xl"></i>
            <p class="text-white/50 mt-4">Loading comments...</p>
          </div>

          <div v-else-if="userComments.length === 0" class="text-center py-20">
            <i class="pi pi-comments text-white/30 text-6xl mb-4"></i>
            <h3 class="text-white/70 text-xl font-medium mb-2">
              {{ isOwnProfile ? 'No comments yet' : `${displayUser?.username} hasn't commented yet` }}
            </h3>
            <p class="text-white/50 mb-6">
              {{ isOwnProfile 
                ? 'Start engaging with posts to see your comments here!' 
                : 'Check back later to see their activity.' 
              }}
            </p>
            <Button 
              v-if="isOwnProfile"
              label="Explore Posts" 
              icon="pi pi-search"
              class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 px-8 py-3 text-lg"
              @click="$router.push('/home')"
            />
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="comment in userComments" 
              :key="comment._id"
              class="comment-card"
            >
              <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {{ profileInitial }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="text-white font-medium">{{ displayUser?.username }}</span>
                      <span class="text-white/50 text-sm">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <p class="text-white/90 mb-3">{{ comment.content }}</p>
                    <div class="text-white/50 text-sm">
                      Commented on: "{{ comment.postTitle || 'a post' }}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Followers Modal -->
    <Dialog 
      v-model:visible="showFollowers" 
      modal 
      header="Followers"
      :style="{ width: '500px' }"
      class="followers-modal"
    >
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div v-if="isLoadingFollowers" class="text-center py-8">
          <i class="pi pi-spinner pi-spin text-gray-500"></i>
          <p class="text-gray-500 mt-2">Loading followers...</p>
        </div>
        
        <div v-else-if="followers.length === 0" class="text-center py-8">
          <i class="pi pi-users text-gray-400 text-3xl mb-3"></i>
          <p class="text-gray-500 mb-2">
            {{ isOwnProfile ? 'No followers yet' : `${displayUser?.username} has no followers yet` }}
          </p>
          <p class="text-gray-400 text-sm">
            {{ isOwnProfile 
              ? 'Share great content to attract followers!' 
              : 'Be the first to follow them!' 
            }}
          </p>
        </div>

        <div v-else>
          <div 
            v-for="follower in followers" 
            :key="follower._id"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ follower.username?.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ follower.username }}</div>
                <div class="text-gray-500 text-sm">{{ follower.email }}</div>
              </div>
            </div>
            <Button 
              label="View" 
              size="small"
              class="p-button-text"
              @click="viewProfile(follower._id)"
            />
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Following Modal -->
    <Dialog 
      v-model:visible="showFollowing" 
      modal 
      header="Following"
      :style="{ width: '500px' }"
      class="following-modal"
    >
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div v-if="isLoadingFollowing" class="text-center py-8">
          <i class="pi pi-spinner pi-spin text-gray-500"></i>
          <p class="text-gray-500 mt-2">Loading following...</p>
        </div>
        
        <div v-else-if="following.length === 0" class="text-center py-8">
          <i class="pi pi-users text-gray-400 text-3xl mb-3"></i>
          <p class="text-gray-500 mb-2">
            {{ isOwnProfile ? 'Not following anyone yet' : `${displayUser?.username} isn't following anyone yet` }}
          </p>
          <p class="text-gray-400 text-sm">
            {{ isOwnProfile 
              ? 'Discover interesting people to follow!' 
              : 'They haven\'t started following others yet.' 
            }}
          </p>
        </div>

        <div v-else>
          <div 
            v-for="user in following" 
            :key="user._id"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ user.username?.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ user.username }}</div>
                <div class="text-gray-500 text-sm">{{ user.email }}</div>
              </div>
            </div>
            <div class="space-x-2">
              <Button 
                label="Unfollow" 
                size="small"
                severity="secondary"
                outlined
                @click="unfollowUser(user._id)"
              />
              <Button 
                label="View" 
                size="small"
                class="p-button-text"
                @click="viewProfile(user._id)"
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    </template>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { postsApi } from '../services/posts'
import { usersApi } from '../services/users'
import { notificationService } from '../services/notifications'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

// Types - Updated to match API types
interface Post {
  _id: string
  title: string
  description: string
  author: {
    _id: string
    username: string
    profilePicture?: string
  }
  likesCount: number
  commentsCount: number
  createdAt: string
}

interface Comment {
  _id: string
  content: string
  authorUsername: string
  createdAt: string
  postTitle?: string // For context of which post was commented on
}

interface User {
  _id: string
  username: string
  email: string
}

interface ProfileUser {
  _id: string
  username: string
  email: string
  bio?: string
  joinedAt?: string
}

const router = useRouter()
const route = useRoute()
const { user: currentUser } = useAuth()

// Reactive data
const activeTab = ref('posts')
const showFollowers = ref(false)
const showFollowing = ref(false)

// Profile user data
const profileUser = ref<ProfileUser | null>(null)
const isLoadingProfile = ref(false)
const profileNotFound = ref(false)

// Loading states
const isLoadingPosts = ref(false)
const isLoadingComments = ref(false)
const isLoadingFollowers = ref(false)
const isLoadingFollowing = ref(false)
const isLoadingFollow = ref(false)

// Data arrays
const userPosts = ref<Post[]>([])
const userComments = ref<Comment[]>([])
const followers = ref<User[]>([])
const following = ref<User[]>([])

// Toast notification
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
})

const followersCount = computed(() => followers.value.length)
const followingCount = computed(() => following.value.length)
const postsCount = computed(() => userPosts.value.length)
const isFollowing = ref(false)
const followRequestSent = ref(false)

// Tab configuration
const tabs = [
  { id: 'posts', label: 'Posts', icon: 'pi pi-images' },
  { id: 'comments', label: 'Comments', icon: 'pi pi-comments' }
]

// Computed
const userId = computed(() => {
  // If no userId in route params, show current user's profile
  return route.params.userId as string || currentUser.value?._id || ''
})

const isOwnProfile = computed(() => {
  return !route.params.userId || userId.value === currentUser.value?._id
})

const displayUser = computed(() => {
  return isOwnProfile.value ? currentUser.value : profileUser.value
})

const profileInitial = computed(() => {
  return displayUser.value?.username?.charAt(0).toUpperCase() || 'U'
})

// Methods
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = { message, type, visible: true }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

const loadProfileUser = async (identifier: string) => {
  if (isOwnProfile.value) {
    profileUser.value = null
    profileNotFound.value = false
    return
  }

  isLoadingProfile.value = true
  profileNotFound.value = false
  try {
    let user
    
    // Check if identifier is a valid ObjectId or username
    if (isValidObjectId(identifier)) {
      // It's an ObjectId, use getUserById
      user = await usersApi.getUserById(identifier)
    } else {
      // It's likely a username, use getUserByUsername
      user = await usersApi.getUserByUsername(identifier)
    }
    
    profileUser.value = {
      _id: user._id,
      username: user.username,
      email: user.email || '',
      bio: user.bio,
      joinedAt: user.createdAt
    }
    
    // Check if current user is following this user using dedicated endpoint
    if (currentUser.value && !isOwnProfile.value) {
      try {
        const followStatus = await usersApi.getFollowStatus(user._id)
        isFollowing.value = followStatus.isFollowing
        followRequestSent.value = followStatus.followRequestSent
      } catch (error) {
        console.error('Error getting follow status:', error)
        // Fallback to user data if dedicated endpoint fails
        isFollowing.value = user.isFollowing || false
        followRequestSent.value = user.followRequestSent || false
      }
    } else {
      // For own profile, set both to false
      isFollowing.value = false
      followRequestSent.value = false
    }
  } catch (error) {
    console.error('Error loading profile user:', error)
    // Set not found state
    profileUser.value = null
    profileNotFound.value = true
  } finally {
    isLoadingProfile.value = false
  }
}

const editProfile = () => {
  // Navigate to edit profile page or open edit modal
  console.log('Edit profile')
}

const shareProfile = () => {
  const username = displayUser.value?.username || 'user'
  if (navigator.share) {
    navigator.share({
      title: `${username}'s Profile`,
      text: `Check out ${username}'s profile on Vibe!`,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    // Show toast notification
  }
}

// Force refresh follow status (more aggressive check)
const forceRefreshFollowStatus = async () => {
  if (isOwnProfile.value || !userId.value || !currentUser.value) return
  
  try {
    const targetUserId = userId.value
    
    // Use dedicated follow status endpoint for maximum accuracy
    const followStatus = await usersApi.getFollowStatus(targetUserId)
    
    // Update follow status
    isFollowing.value = followStatus.isFollowing
    followRequestSent.value = followStatus.followRequestSent
    
  } catch (error) {
    console.error('Error force refreshing follow status:', error)
  }
}

const handleFollowAction = async () => {
  if (isLoadingFollow.value) return
  
  try {
    if (!userId.value) return
    
    isLoadingFollow.value = true
    
    if (isFollowing.value) {
      // Unfollow the user
      const response = await usersApi.unfollowUser(userId.value)
      
      // Update state immediately for reactive UI
      isFollowing.value = false
      followRequestSent.value = false
      
      // Update followers list - remove current user from followers
      followers.value = followers.value.filter(f => f._id !== currentUser.value?._id)
      
      showToast(response.message || 'Successfully unfollowed user', 'success')
      
      // Force refresh to ensure accuracy
      await forceRefreshFollowStatus()
    } else if (followRequestSent.value) {
      // Cancel follow request
      await notificationService.cancelFollowRequest(userId.value)
      
      // Update state immediately for reactive UI
      followRequestSent.value = false
      
      showToast('Follow request cancelled', 'success')
      
      // Force refresh to ensure accuracy
      await forceRefreshFollowStatus()
    } else {
      // Send follow request
      try {
        await notificationService.sendFollowRequest(userId.value)
        
        // Update state immediately for reactive UI
        followRequestSent.value = true
        
        showToast('Follow request sent', 'success')
        
        // Force refresh to ensure accuracy
        await forceRefreshFollowStatus()
      } catch (error: any) {
        if (error.message === 'Follow request already sent') {
          // The request already exists, just update the UI
          followRequestSent.value = true
          showToast('Follow request already sent', 'info')
          
          // Force refresh to ensure accuracy
          await forceRefreshFollowStatus()
        } else {
          throw error // Re-throw other errors to be handled by outer catch
        }
      }
    }
    
  } catch (error: any) {
    console.error('Error handling follow action:', error)
    
    let errorMessage = 'Failed to update follow status'
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    // More specific error messages
    if (error?.response?.status === 404) {
      errorMessage = 'User not found'
    } else if (error?.response?.status === 409) {
      errorMessage = error?.response?.data?.message || 'Action already performed'
    } else if (error?.response?.status === 401) {
      errorMessage = 'Please log in to continue'
    } else if (error?.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.'
    }
    
    showToast(errorMessage, 'error')
    
    // On error, refresh the follow status to ensure UI is accurate
    await forceRefreshFollowStatus()
  } finally {
    isLoadingFollow.value = false
  }
}

const messageUser = () => {
  // Navigate to messages or open message modal
  console.log('Message user:', userId.value)
  // router.push(`/messages/${userId.value}`)
}

const openPost = (post: Post) => {
  // Navigate to post detail page
  console.log('Open post:', post)
  router.push(`/post/${post._id}`)
}

const viewProfile = (targetUserId: string) => {
  // Navigate to user's profile
  console.log('View profile:', targetUserId)
  router.push(`/profile/${targetUserId}`)
}

const unfollowUser = async (targetUserId: string) => {
  try {
    // Unfollow user via API
    await usersApi.unfollowUser(targetUserId)
    
    // Remove from following list
    following.value = following.value.filter(u => u._id !== targetUserId)
  } catch (error) {
    console.error('Error unfollowing user:', error)
    // You could show a toast notification here
  }
}

const formatDate = (date: string) => {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  )
}

// Follow button helper functions
// These functions determine the button state based on the current user's follow status
// for the profile being viewed (not the profile owner's perspective)
const getFollowButtonText = () => {
  if (isFollowing.value) {
    return 'Unfollow'
  } else if (followRequestSent.value) {
    return 'Pending'
  } else {
    return 'Follow'
  }
}

const getFollowButtonIcon = () => {
  if (isFollowing.value) {
    return 'pi pi-user-minus'
  } else if (followRequestSent.value) {
    return 'pi pi-clock'
  } else {
    return 'pi pi-user-plus'
  }
}

const getFollowButtonClasses = () => {
  if (isFollowing.value) {
    return 'bg-white/10 border border-white/30 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300'
  } else if (followRequestSent.value) {
    return 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
  } else {
    return 'bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:shadow-lg hover:shadow-pink-500/25'
  }
}

// Mock data loading functions - Updated to use real API calls
const loadUserPosts = async () => {
  isLoadingPosts.value = true
  try {
    let targetUserId = ''
    
    if (isOwnProfile.value) {
      targetUserId = currentUser.value?._id || ''
    } else {
      // For other users, we need to get the actual user ID
      if (profileUser.value) {
        targetUserId = profileUser.value._id
      } else {
        // If profileUser is not loaded yet, we need to resolve the identifier first
        const identifier = userId.value
        if (isValidObjectId(identifier)) {
          targetUserId = identifier
        } else {
          // It's a username, resolve to user ID
          try {
            const user = await usersApi.getUserByUsername(identifier)
            targetUserId = user._id
          } catch (error) {
            console.error('Error resolving username to user ID:', error)
            userPosts.value = []
            return
          }
        }
      }
    }
    
    if (!targetUserId) {
      userPosts.value = []
      return
    }

    // Fetch real posts from API
    const response = await postsApi.getByUser(targetUserId, 1, 20)
    
    // Transform API posts to our simplified format
    userPosts.value = response.posts.map(post => ({
      _id: post._id,
      title: post.title,
      description: post.description,
      author: post.author,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt
    }))
  } catch (error) {
    console.error('Error loading posts:', error)
    userPosts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

const loadUserComments = async () => {
  isLoadingComments.value = true
  try {
    let targetUserId = ''
    
    if (isOwnProfile.value) {
      targetUserId = currentUser.value?._id || ''
    } else {
      // For other users, we need to get the actual user ID
      if (profileUser.value) {
        targetUserId = profileUser.value._id
      } else {
        // If profileUser is not loaded yet, we need to resolve the identifier first
        const identifier = userId.value
        if (isValidObjectId(identifier)) {
          targetUserId = identifier
        } else {
          // It's a username, resolve to user ID
          try {
            const user = await usersApi.getUserByUsername(identifier)
            targetUserId = user._id
          } catch (error) {
            console.error('Error resolving username to user ID:', error)
            userComments.value = []
            return
          }
        }
      }
    }
    
    if (!targetUserId) {
      userComments.value = []
      return
    }

    // This is a simplified approach - in reality you'd want a dedicated endpoint
    const response = await postsApi.getByUser(targetUserId, 1, 10)
    
    // Extract comments made by this user across all posts (simplified)
    const allComments: Comment[] = []
    for (const post of response.posts) {
      if (post.comments && post.comments.length > 0) {
        const userComments = post.comments
          .filter(comment => comment.author === targetUserId)
          .map(comment => ({
            _id: comment._id,
            content: comment.content,
            authorUsername: comment.authorUsername,
            createdAt: comment.createdAt,
            postTitle: post.title
          }))
        allComments.push(...userComments)
      }
    }
    
    userComments.value = allComments.slice(0, 10) // Limit to 10 comments
  } catch (error) {
    console.error('Error loading comments:', error)
    userComments.value = []
  } finally {
    isLoadingComments.value = false
  }
}

const loadFollowers = async () => {
  isLoadingFollowers.value = true
  try {
    if (isOwnProfile.value) {
      // Load current user's followers
      const response = await usersApi.getFollowers(1, 50)
      followers.value = response.users.map(user => ({
        _id: user._id,
        username: user.username,
        email: user.email || ''
      }))
    } else {
      // For other users, we'd need an API endpoint like /users/{userId}/followers
      // For now, simulate with empty array or basic data
      followers.value = []
    }
  } catch (error) {
    console.error('Error loading followers:', error)
    followers.value = []
  } finally {
    isLoadingFollowers.value = false
  }
}

const loadFollowing = async () => {
  isLoadingFollowing.value = true
  try {
    if (isOwnProfile.value) {
      // Load current user's following
      const response = await usersApi.getFollowing(1, 50)
      following.value = response.users.map(user => ({
        _id: user._id,
        username: user.username,
        email: user.email || ''
      }))
    } else {
      // For other users, we'd need an API endpoint like /users/{userId}/following
      // For now, simulate with empty array or basic data
      following.value = []
    }
  } catch (error) {
    console.error('Error loading following:', error)
    following.value = []
  } finally {
    isLoadingFollowing.value = false
  }
}

// Comprehensive data refresh function
const refreshProfileData = async () => {
  const targetUserId = userId.value
  const previousUserId = profileUser.value?._id
  
  // Reset data arrays
  userPosts.value = []
  userComments.value = []
  followers.value = []
  following.value = []
  profileNotFound.value = false
  
  // Only reset follow status if we're switching to a different user
  if (targetUserId !== previousUserId) {
    isFollowing.value = false
    followRequestSent.value = false
  }
  
  if (targetUserId && targetUserId !== currentUser.value?._id) {
    // Load other user's profile
    await loadProfileUser(targetUserId)
  } else {
    // Reset to own profile
    profileUser.value = null
  }
  
  // Load posts data (only if profile was found or it's own profile)
  if (!profileNotFound.value) {
    await loadUserPosts()
    // Also refresh counts for accurate display
    await refreshCounts()
  }
}

const refreshCounts = async () => {
  try {
    // For own profile, get fresh follower/following counts
    if (isOwnProfile.value) {
      const [followersRes, followingRes] = await Promise.all([
        usersApi.getFollowers(1, 1), // Just get count
        usersApi.getFollowing(1, 1)  // Just get count
      ])
      
      // Update counts based on total from API
      if (followersRes.total !== undefined) {
        // If we have actual data, use it, otherwise use total count
        if (followers.value.length === 0) {
          followers.value = followersRes.users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email || ''
          }))
        }
      }
      
      if (followingRes.total !== undefined) {
        if (following.value.length === 0) {
          following.value = followingRes.users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email || ''
          }))
        }
      }
    }
    
    // Posts count is handled by the computed property based on userPosts.length
  } catch (error) {
    console.error('Error refreshing counts:', error)
  }
}

// Force refresh all data (useful for testing or after important changes)
const forceRefresh = async () => {
  console.log('🔄 Force refreshing profile data...')
  await refreshProfileData()
}

// Expose forceRefresh for debugging
if (import.meta.env.DEV) {
  (window as any).forceRefreshProfile = forceRefresh
}

// Debug function to check follow status (development only)
if (import.meta.env.DEV) {
  (window as any).checkFollowStatus = async () => {
    if (!profileUser.value) {
      console.log('No profile user loaded')
      return
    }
    
    console.log('=== Current Follow Status ===')
    console.log('Profile User ID:', profileUser.value._id)
    console.log('Profile Username:', profileUser.value.username)
    console.log('Current User ID:', currentUser.value?._id)
    console.log('Is Following:', isFollowing.value)
    console.log('Follow Request Sent:', followRequestSent.value)
    console.log('Button Text:', getFollowButtonText())
    
    // Check with dedicated endpoint
    try {
      const followStatus = await usersApi.getFollowStatus(profileUser.value._id)
      console.log('Follow Status from Dedicated API:', followStatus)
    } catch (error) {
      console.error('Error getting follow status from API:', error)
    }
    
    console.log('=== End Follow Status ===')
  }
}

// Watch for route changes to load different user profiles
watch(() => route.params.userId, async () => {
  await refreshProfileData()
}, { immediate: true })

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'posts' && userPosts.value.length === 0) {
    loadUserPosts()
  } else if (newTab === 'comments' && userComments.value.length === 0) {
    loadUserComments()
  }
})

// Watch for modal opens - always refresh data when modals open
watch(showFollowers, (show) => {
  if (show) loadFollowers()
})

watch(showFollowing, (show) => {
  if (show) loadFollowing()
})

// Watch for changes in current user (e.g., after login/logout)
watch(() => currentUser.value, async (newUser, oldUser) => {
  // Only refresh if the user actually changed (not just reactivity trigger)
  if (newUser?._id !== oldUser?._id) {
    await refreshProfileData()
  }
}, { deep: true })

// Watch for route userId changes to ensure follow status is refreshed
watch(() => route.params.userId, async (newUserId, oldUserId) => {
  // If we're now viewing a different user's profile, ensure follow status is accurate
  if (newUserId && newUserId !== oldUserId && !isOwnProfile.value) {
    // Small delay to ensure profile is loaded first
    await nextTick()
    // Force refresh follow status using dedicated endpoint
    await forceRefreshFollowStatus()
  }
})

// Initialize - refresh data on mount
onMounted(async () => {
  await refreshProfileData()
})
</script>

<style scoped>
.post-card:hover {
  transform: translateY(-4px);
}

.comment-card {
  transition: all 0.3s ease;
}

.comment-card:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar for modals */
.followers-modal :deep(.p-dialog-content),
.following-modal :deep(.p-dialog-content) {
  padding: 0;
}

.followers-modal :deep(.p-dialog-header),
.following-modal :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tab active state animations */
.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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
</style>
