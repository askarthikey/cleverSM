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
      <!-- Search Bar and Create Button -->
      <div class="mb-8 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white font-semibold">{{ userInitial }}</span>
          </div>
          <div class="flex-1 relative search-container">
            <input 
              v-model="searchQuery"
              placeholder="Search posts, users, or topics..."
              class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full px-4 py-3 pl-12 pr-12 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all duration-200"
              @keyup.enter="performSearch"
              @keyup.esc="clearSearch"
              @input="handleSearchInput"
            />
            <i 
              :class="isSearching ? 'pi pi-spin pi-spinner' : 'pi pi-search'" 
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
            ></i>
            <!-- Clear search button -->
            <button
              v-if="searchQuery.trim()"
              @click="clearSearch"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors hover:scale-110"
              title="Clear search"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
          <button 
            @click="$router.push('/create')"
            class="create-btn h-12 w-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200"
            title="Create new post"
          >
            <i class="pi pi-plus text-white text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Search Status Indicator -->
      <div v-if="isSearchMode" class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <i class="pi pi-search text-blue-400"></i>
            <span class="text-white/80">
              Found <strong class="text-white">{{ posts.length }}</strong> result{{ posts.length !== 1 ? 's' : '' }} for: <strong class="text-white">"{{ searchQuery }}"</strong>
            </span>
          </div>
          <!-- <button
            @click="clearSearch"
            class="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center space-x-1"
          >
            <i class="pi pi-times text-xs"></i>
            <span>Clear search</span>
          </button> -->
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
            <div class="flex items-center space-x-4 mb-4">
              <div class="h-12 w-12 bg-white/20 rounded-full"></div>
              <div class="space-y-2 flex-1">
                <div class="h-4 bg-white/20 rounded w-1/4"></div>
                <div class="h-3 bg-white/20 rounded w-1/6"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-white/20 rounded w-3/4"></div>
              <div class="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl inline-block">
          <i class="pi pi-exclamation-triangle text-red-400 text-3xl mb-4"></i>
          <p class="text-red-400 mb-4">{{ error }}</p>
          <Button 
            label="Try Again" 
            icon="pi pi-refresh"
            class="p-button-outlined border-red-400 text-red-400 hover:bg-red-400/10"
            @click="fetchPosts"
          />
        </div>
      </div>

      <!-- Posts List -->
      <div v-else-if="posts.length > 0" class="space-y-6">
        <div v-for="post in posts" :key="post._id" class="post-card" :data-post-id="post._id">
          <div class="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/15 transition-colors">
            <!-- Post Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold">{{ getInitial(post.author.username) }}</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold">{{ post.author.username }}</h3>
                  <p class="text-white/60 text-sm">{{ formatDate(post.createdAt) }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2">
                  <i 
                    v-if="post.privacy === 'public'" 
                    class="pi pi-globe text-white/60" 
                    title="Public"
                  ></i>
                  <i 
                    v-else-if="post.privacy === 'friends'" 
                    class="pi pi-users text-white/60" 
                    title="Friends only"
                  ></i>
                  <i 
                    v-else-if="post.privacy === 'private'" 
                    class="pi pi-lock text-white/60" 
                    title="Private"
                  ></i>
                </div>
                
                <!-- Delete button - only show for post author -->
                <button
                  v-if="user?.username === post.author.username"
                  @click="deletePost(post._id)"
                  class="opacity-60 hover:opacity-100 text-white/50 hover:text-red-400 transition-all duration-200 p-2 hover:bg-red-500/20 rounded-lg"
                  title="Delete post"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Post Content -->
            <div class="mb-4">
              <h2 class="text-xl font-bold text-white mb-2">{{ post.title }}</h2>
              <p class="text-white/80 leading-relaxed">{{ post.description }}</p>
            </div>

            <!-- Post Tags -->
            <div v-if="post.tags && post.tags.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag"
                  class="px-3 py-1 bg-white/20 text-white/80 rounded-full text-sm"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Post Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-white/20">
              <div class="flex items-center space-x-6">
                <!-- Like Button -->
                <button 
                  @click="toggleLike(post._id)"
                  class="flex items-center space-x-2 text-white/70 hover:text-pink-400 transition-colors"
                  :class="{ 'text-pink-400': post.isLiked }"
                >
                  <i :class="post.isLiked ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
                  <span>{{ post.likesCount }}</span>
                </button>

                <!-- Comment Button -->
                <button 
                  @click="toggleComments(post._id)"
                  class="flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-colors"
                >
                  <i class="pi pi-comment"></i>
                  <span>{{ post.commentsCount }}</span>
                </button>

                <!-- Share Button with Dropdown -->
                <div class="relative">
                  <button 
                    @click="toggleShareMenu(post._id)"
                    class="flex items-center space-x-2 text-white/70 hover:text-green-400 transition-colors share-button"
                    :class="{ 'text-green-400': post.isShared }"
                  >
                    <i class="pi pi-share-alt"></i>
                    <span>{{ post.sharesCount }}</span>
                  </button>

                  <!-- Share Dropdown Menu -->
                  <div 
                    v-if="openShareMenus.includes(post._id)"
                    class="absolute bottom-full left-0 mb-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-50 min-w-48 share-dropdown"
                  >
                    <div class="p-2">
                      <button
                        @click="shareToFeed(post._id)"
                        class="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <i class="pi pi-share-alt text-green-400"></i>
                        <span>{{ post.isShared ? 'Remove from your feed' : 'Share to your feed' }}</span>
                      </button>
                      <button
                        @click="copyToClipboard(post._id)"
                        class="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <i class="pi pi-copy text-blue-400"></i>
                        <span>Copy link</span>
                      </button>
                      <button
                        @click="shareExternal(post._id, 'twitter')"
                        class="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <i class="pi pi-twitter text-blue-500"></i>
                        <span>Share on Twitter</span>
                      </button>
                      <button
                        @click="shareExternal(post._id, 'facebook')"
                        class="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <i class="pi pi-facebook text-blue-600"></i>
                        <span>Share on Facebook</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- More Options -->
              <button class="text-white/50 hover:text-white/70 transition-colors">
                <i class="pi pi-ellipsis-h"></i>
              </button>
            </div>

            <!-- Comments Section (if expanded) -->
            <div v-if="expandedPosts.includes(post._id)" class="mt-4 pt-4 border-t border-white/20">
              <div class="space-y-4">
                <!-- Add Comment -->                  <div class="flex space-x-3">
                  <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-semibold">{{ userInitial }}</span>
                  </div>
                  <div class="flex-1 relative">
                    <input 
                      v-model="newComments[post._id]"
                      placeholder="Write a comment..."
                      class="comment-input w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full px-4 py-3 pr-14 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all duration-200"
                      @keyup.enter="addComment(post._id)"
                    />
                    <button
                      @click="addComment(post._id)"
                      :disabled="!newComments[post._id]?.trim()"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover-scale"
                      :class="newComments[post._id]?.trim() ? 'bg-gradient-to-r from-pink-500 to-violet-500 hover:shadow-lg hover:shadow-pink-500/25' : 'bg-white/20'"
                    >
                      <i class="pi pi-send text-white text-sm" :class="{ 'animate-pulse': newComments[post._id]?.trim() }"></i>
                    </button>
                  </div>
                </div>

                <!-- Comments List -->
                <div v-if="post.comments && post.comments.length > 0" class="space-y-3">
                  <div 
                    v-for="comment in sortedComments(post.comments).slice(0, 3)" 
                    :key="comment._id"
                    class="flex space-x-3 group"
                  >
                    <div class="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-xs font-semibold">{{ getInitial(comment.authorUsername) }}</span>
                    </div>
                    <div class="flex-1 bg-white/10 rounded-lg px-3 py-2 relative">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-white/80 font-medium text-sm">{{ comment.authorUsername }}</span>
                        <div class="flex items-center space-x-2">
                          <span class="text-white/50 text-xs">{{ formatDate(comment.createdAt) }}</span>
                          <!-- Delete button - only show for comment author -->
                          <button
                            v-if="user?.username === comment.authorUsername"
                            @click="deleteComment(post._id, comment._id)"
                            class="comment-delete-btn text-white/50 hover:text-red-400 transition-all duration-200 p-1 hover:bg-red-500/20 rounded"
                            title="Delete comment"
                          >
                            <i class="pi pi-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                      <p class="text-white/70 text-sm">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMorePosts" class="text-center py-6">
          <Button 
            :label="isSearchMode ? 'Load More Results' : 'Load More Posts'" 
            icon="pi pi-chevron-down"
            class="p-button-outlined border-white/30 text-white hover:bg-white/10"
            @click="loadMorePosts"
            :loading="loadingMore"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="mb-6">
          <i :class="isSearchMode ? 'pi pi-search text-blue-400' : 'pi pi-heart text-white/30'" class="text-6xl mb-4"></i>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">
          {{ isSearchMode ? 'No search results found' : 'Welcome to Vibe!' }}
        </h3>
        <p class="text-white/70 mb-6 max-w-md mx-auto">
          {{ isSearchMode 
            ? `No posts found for "${searchQuery}". Try searching for something else.`
            : 'Be the first to share something amazing. Create your first post and start connecting with others.'
          }}
        </p>
        <Button 
          v-if="isSearchMode"
          label="Clear Search" 
          icon="pi pi-times"
          class="p-button-outlined border-blue-400 text-blue-400 hover:bg-blue-400/10 mr-4"
          @click="clearSearch"
        />
        <Button 
          :label="isSearchMode ? 'Create Post' : 'Create Your First Post'" 
          icon="pi pi-plus"
          class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 hover:shadow-lg hover:shadow-pink-500/25"
          @click="$router.push('/create')"
          size="large"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { postsApi, type Post, type Comment } from '../services/posts'
import api from '../services/api'

const { user } = useAuth()

// State
const posts = ref<Post[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')
const expandedPosts = ref<string[]>([])
const newComments = ref<Record<string, string>>({})
const currentPage = ref(1)
const totalPages = ref(1)
const openShareMenus = ref<string[]>([])
const toast = ref<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
  message: '',
  type: 'success',
  visible: false
})

// Search state
const searchQuery = ref('')
const searchResults = ref<Post[]>([])
const showSearchResults = ref(false)
const searchTimeout = ref<number | null>(null)
const isSearchMode = ref(false)
const originalPosts = ref<Post[]>([]) // Store original posts for reset
const isSearching = ref(false) // Add search loading state

// Click outside handler for share menus
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  
  // Check if the click is outside any share dropdown or share button
  const isInsideShareMenu = target.closest('.share-dropdown') || target.closest('.share-button')
  
  if (!isInsideShareMenu && openShareMenus.value.length > 0) {
    openShareMenus.value = []
  }
}

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = { message, type, visible: true }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

// Search functions
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
    // Immediately reset when search is cleared
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
    
    // Save original posts if not already in search mode
    if (!isSearchMode.value) {
      originalPosts.value = [...posts.value]
      isSearchMode.value = true
    }

    const response = await postsApi.search(query, 1, 50) // Get more results for filtering
    posts.value = response.posts
    
    if (response.posts.length === 0) {
      showToast(`No posts found for "${query}"`, 'info')
    } else {
      showToast(`Found ${response.posts.length} post${response.posts.length !== 1 ? 's' : ''}`, 'success')
    }
  } catch (err) {
    console.error('Search error:', err)
    showToast('Search failed', 'error')
  } finally {
    isSearching.value = false
  }
}

const resetSearch = async () => {
  if (isSearchMode.value) {
    if (originalPosts.value.length > 0) {
      posts.value = [...originalPosts.value]
      isSearchMode.value = false
      // Reset pagination to original state
      currentPage.value = 1
      totalPages.value = Math.ceil(originalPosts.value.length / 10)
    } else {
      // If no original posts stored, fetch fresh data
      isSearchMode.value = false
      await fetchPosts()
    }
  }
  searchResults.value = []
  showSearchResults.value = false
}

const clearSearch = async () => {
  searchQuery.value = ''
  await resetSearch()
  showToast('Search cleared', 'info')
}

// Computed
const hasMorePosts = computed(() => currentPage.value < totalPages.value)
const userInitial = computed(() => user.value?.username?.charAt(0).toUpperCase() || 'U')

// Methods
const fetchPosts = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Use getFeed to get posts from followed users + own posts
    let response
    try {
      // Direct API call to avoid issues with corrupted posts.ts
      const apiResponse = await api.get('/posts/feed', {
        params: { page: 1, limit: 10 }
      })
      response = apiResponse.data.data
    } catch (feedError) {
      // Fallback to public posts if getFeed fails (e.g., user not authenticated)
      console.warn('Feed not available, falling back to public posts:', feedError)
      response = await postsApi.getAll(1, 10, 'public')
    }
    
    posts.value = response.posts
    // Always store original posts when fetching fresh data (not in search mode)
    if (!isSearchMode.value) {
      originalPosts.value = [...response.posts]
    }
    currentPage.value = response.page
    totalPages.value = response.totalPages
  } catch (err) {
    error.value = 'Failed to load posts. Please try again.'
    console.error('Error fetching posts:', err)
  } finally {
    loading.value = false
  }
}

const loadMorePosts = async () => {
  try {
    loadingMore.value = true
    
    if (isSearchMode.value) {
      // In search mode, try to load more search results
      const response = await postsApi.search(searchQuery.value, currentPage.value + 1, 10)
      posts.value.push(...response.posts)
      currentPage.value = response.page
    } else {
      // Normal mode, load more feed posts
      try {
        // Direct API call to avoid issues with corrupted posts.ts
        const apiResponse = await api.get('/posts/feed', {
          params: { page: currentPage.value + 1, limit: 10 }
        })
        const response = apiResponse.data.data
        posts.value.push(...response.posts)
        originalPosts.value.push(...response.posts) // Also update original posts
        currentPage.value = response.page
      } catch (feedError) {
        // Fallback to public posts if getFeed fails
        console.warn('Feed not available, falling back to public posts:', feedError)
        const response = await postsApi.getAll(currentPage.value + 1, 10, 'public')
        posts.value.push(...response.posts)
        originalPosts.value.push(...response.posts) // Also update original posts
        currentPage.value = response.page
      }
    }
  } catch (err) {
    console.error('Error loading more posts:', err)
    showToast('Failed to load more posts', 'error')
  } finally {
    loadingMore.value = false
  }
}

const toggleLike = async (postId: string) => {
  try {
    const post = posts.value.find(p => p._id === postId)
    if (!post) return
    
    const response = await postsApi.like(postId)
    
    // Update the post with the API response
    post.isLiked = response.liked
    post.likesCount = response.likesCount
    
    // Show notification
    showToast(response.liked ? 'Post liked!' : 'Like removed', 'success')
  } catch (err) {
    console.error('Error toggling like:', err)
    showToast('Failed to update like', 'error')
  }
}

const deletePost = async (postId: string) => {
  try {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }
    
    await postsApi.delete(postId)
    
    // Remove the post from the local state
    const postIndex = posts.value.findIndex(p => p._id === postId)
    if (postIndex > -1) {
      posts.value.splice(postIndex, 1)
    }
    
    showToast('Post deleted successfully!', 'success')
  } catch (err) {
    console.error('Error deleting post:', err)
    showToast('Failed to delete post', 'error')
  }
}

const toggleShareMenu = (postId: string) => {
  const index = openShareMenus.value.indexOf(postId)
  if (index > -1) {
    openShareMenus.value.splice(index, 1)
  } else {
    // Close other share menus and open this one
    openShareMenus.value = [postId]
  }
}

const shareToFeed = async (postId: string) => {
  try {
    const post = posts.value.find(p => p._id === postId)
    if (!post) return
    
    const response = await postsApi.share(postId)
    
    // Update the post with the response
    post.isShared = response.shared
    post.sharesCount = response.sharesCount
    
    showToast(response.shared ? 'Post shared to your feed!' : 'Post removed from your feed!', 'success')
  } catch (err) {
    console.error('Error sharing to feed:', err)
    showToast('Failed to share post', 'error')
  } finally {
    // Close the share menu
    const index = openShareMenus.value.indexOf(postId)
    if (index > -1) {
      openShareMenus.value.splice(index, 1)
    }
  }
}

const copyToClipboard = async (postId: string) => {
  try {
    const post = posts.value.find(p => p._id === postId)
    if (!post) return

    const url = `${window.location.origin}/posts/${postId}`
    await navigator.clipboard.writeText(url)
    showToast('Link copied to clipboard!', 'success')
    
    // Don't increment share count locally for copy link
    // This action doesn't affect the feed share status
    
  } catch (err) {
    console.error('Failed to copy link:', err)
    showToast('Failed to copy link', 'error')
  } finally {
    // Close the share menu
    const index = openShareMenus.value.indexOf(postId)
    if (index > -1) {
      openShareMenus.value.splice(index, 1)
    }
  }
}

const shareExternal = async (postId: string, platform: 'twitter' | 'facebook') => {
  try {
    const post = posts.value.find(p => p._id === postId)
    if (!post) return

    const url = `${window.location.origin}/posts/${postId}`
    const text = `Check out this post: "${post.title}"`
    
    let shareUrl = ''
    
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      showToast(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 'success')
      
      // Don't increment share count locally for external shares
      // This action doesn't affect the feed share status
    }
  } catch (err) {
    console.error('Error sharing externally:', err)
    showToast('Failed to share post', 'error')
  } finally {
    // Close the share menu
    const index = openShareMenus.value.indexOf(postId)
    if (index > -1) {
      openShareMenus.value.splice(index, 1)
    }
  }
}

const toggleComments = (postId: string) => {
  const index = expandedPosts.value.indexOf(postId)
  if (index > -1) {
    expandedPosts.value.splice(index, 1)
  } else {
    expandedPosts.value.push(postId)
  }
}

const addComment = async (postId: string) => {
  const content = newComments.value[postId]?.trim()
  if (!content) return
  
  try {
    const comment = await postsApi.addComment(postId, { content })
    
    // Find the post and add the comment optimistically
    const post = posts.value.find(p => p._id === postId)
    if (post) {
      if (!post.comments) {
        post.comments = []
      }
      post.comments.unshift(comment) // Add to beginning for newest first
      post.commentsCount = (post.commentsCount || 0) + 1
    }
    
    // Clear the input
    newComments.value[postId] = ''
    
    showToast('Comment added!', 'success')
  } catch (err) {
    console.error('Error adding comment:', err)
    showToast('Failed to add comment', 'error')
  }
}

const deleteComment = async (postId: string, commentId: string) => {
  try {
    // Call the API to delete the comment
    await postsApi.deleteComment(postId, commentId)
    
    // Find the post and remove the comment optimistically
    const post = posts.value.find(p => p._id === postId)
    if (post && post.comments) {
      const commentIndex = post.comments.findIndex(c => c._id === commentId)
      if (commentIndex > -1) {
        post.comments.splice(commentIndex, 1)
        post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1)
      }
    }
    
    showToast('Comment deleted!', 'success')
  } catch (err) {
    console.error('Error deleting comment:', err)
    showToast('Failed to delete comment', 'error')
  }
}

const getInitial = (username: string) => {
  return username.charAt(0).toUpperCase()
}

const sortedComments = (comments: Comment[]) => {
  // Sort comments by creation date, newest first
  return [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  
  return date.toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchPosts()
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.post-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar for comments */
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

/* Send button animations */
@keyframes sendPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.send-button-active {
  animation: sendPulse 0.3s ease-in-out;
}

/* Toast notification transitions */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Hover effects for interactive elements */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Comment delete button hover effect */
.comment-delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.group:hover .comment-delete-btn {
  opacity: 1;
}

.comment-delete-btn:hover {
  transform: scale(1.1);
}

/* Enhanced input focus styles */
.comment-input:focus {
  transform: scale(1.01);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Search input styles */
.search-container input:focus {
  transform: scale(1.005);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Search results dropdown */
.search-container .absolute {
  backdrop-filter: blur(20px);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Post delete button */
.post-delete-btn {
  transition: all 0.2s ease;
}

.post-delete-btn:hover {
  transform: scale(1.05);
  background-color: rgba(239, 68, 68, 0.2);
}

/* Create button animation */
.create-btn {
  transition: all 0.2s ease;
}

.create-btn:hover {
  transform: scale(1.05) rotate(90deg);
}
</style>
