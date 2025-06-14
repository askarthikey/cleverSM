<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-bold text-white mb-2">Create New Post</h2>
        <p class="text-white/70 text-lg">Share your thoughts with the world</p>
      </div>

      <!-- Create Post Form -->
      <div class="p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
        <form @submit.prevent="handleCreatePost" class="space-y-6">
          <!-- Title Field -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm flex items-center space-x-2">
              <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h5a1 1 0 110 2h-1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 110-2h5z"></path>
              </svg>
              <span>Post Title</span>
            </label>
            <div class="relative">
              <input
                v-model="formData.title"
                type="text"
                placeholder="What's on your mind?"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-4 pl-12 focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.title, 'border-green-500': formData.title && !errors.title }"
                maxlength="100"
                @input="validateTitle"
              />
              <svg class="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span 
                  class="text-xs"
                  :class="formData.title.length > 80 ? 'text-yellow-400' : 'text-white/50'"
                >
                  {{ formData.title.length }}/100
                </span>
              </div>
            </div>
            <p v-if="errors.title" class="text-red-400 text-sm">{{ errors.title }}</p>
          </div>

          <!-- Description Field -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm flex items-center space-x-2">
              <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
              </svg>
              <span>Description</span>
            </label>
            <div class="relative">
              <textarea
                v-model="formData.description"
                placeholder="Tell us more about your post..."
                rows="6"
                class="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-4 pl-12 pt-4 resize-none focus:border-pink-500 focus:outline-none transition-colors"
                :class="{ 'border-red-500': errors.description, 'border-green-500': formData.description && !errors.description }"
                maxlength="500"
                @input="validateDescription"
              ></textarea>
              <svg class="w-4 h-4 absolute left-4 top-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <div class="absolute right-4 bottom-4">
                <span 
                  class="text-xs"
                  :class="formData.description.length > 400 ? 'text-yellow-400' : 'text-white/50'"
                >
                  {{ formData.description.length }}/500
                </span>
              </div>
            </div>
            <p v-if="errors.description" class="text-red-400 text-sm">{{ errors.description }}</p>
          </div>

          <!-- Privacy Setting -->
          <div class="space-y-2">
            <label class="text-white font-semibold text-sm flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span>Privacy</span>
            </label>
            <select
              v-model="formData.privacy"
              class="w-full bg-white/10 border border-white/20 text-white rounded-xl p-4 focus:border-pink-500 focus:outline-none transition-colors"
            >
              <option value="public" class="bg-gray-800 text-white">🌍 Public - Anyone can see</option>
              <option value="followers" class="bg-gray-800 text-white">👥 Followers - Only followers can see</option>
              <option value="friends" class="bg-gray-800 text-white">👫 Friends - Only friends can see</option>
              <option value="private" class="bg-gray-800 text-white">🔒 Private - Only you can see</option>
            </select>
          </div>

          <!-- Post Options -->
          <div class="space-y-4">
            <label class="text-white font-semibold text-sm flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Post Options</span>
            </label>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Comments Setting -->
              <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <div class="flex items-center space-x-3">
                  <input
                    id="allowComments"
                    v-model="formData.allowComments"
                    type="checkbox"
                    class="w-4 h-4 text-pink-500 bg-white/10 border-white/20 rounded focus:ring-pink-500"
                  />
                  <div class="flex-1">
                    <label for="allowComments" class="text-white font-medium text-sm cursor-pointer">
                      Allow Comments
                    </label>
                    <div class="text-white/60 text-xs">Let others comment on your post</div>
                  </div>
                </div>
              </div>

              <!-- Allow Shares -->
              <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <div class="flex items-center space-x-3">
                  <input
                    id="allowShares"
                    v-model="formData.allowShares"
                    type="checkbox"
                    class="w-4 h-4 text-pink-500 bg-white/10 border-white/20 rounded focus:ring-pink-500"
                  />
                  <div class="flex-1">
                    <label for="allowShares" class="text-white font-medium text-sm cursor-pointer">
                      Allow Shares
                    </label>
                    <div class="text-white/60 text-xs">Let others share your post</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <!-- Save as Draft -->
            <button
              type="button"
              @click="saveDraft"
              :disabled="!formData.title && !formData.description"
              class="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              <span>Save Draft</span>
            </button>

            <!-- Publish Post -->
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              class="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Publishing...' : 'Publish Post' }}</span>
            </button>
          </div>

          <!-- API Error Display -->
          <div v-if="apiError" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.896-.833-2.664 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p class="text-red-200 text-sm">{{ apiError }}</p>
            </div>
          </div>
        </form>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 max-w-sm mx-4">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">Post Published!</h3>
          <p class="text-white/70 mb-4">Your post has been shared successfully.</p>
          <div class="flex flex-col space-y-2">
            <button
              @click="viewPost"
              class="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
            >
              View Post
            </button>
            <button
              @click="createAnother"
              class="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/20 transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { postsApi, type CreatePostData } from '../services/posts'

const router = useRouter()
const { isAuthenticated } = useAuth()

// Form data
const formData = ref<CreatePostData>({
  title: '',
  description: '',
  allowComments: true,
  allowShares: true,
  isPublic: true,
  privacy: 'public',
  tags: []
})

// Form state
const isLoading = ref(false)
const showSuccess = ref(false)
const apiError = ref('')
const createdPostId = ref('')

// Errors
const errors = ref({
  title: '',
  description: ''
})

// Validation functions
const validateTitle = () => {
  const title = formData.value.title.trim()
  
  if (!title) {
    errors.value.title = ''
    return
  }

  if (title.length < 3) {
    errors.value.title = 'Title must be at least 3 characters long'
    return
  }

  if (title.length > 100) {
    errors.value.title = 'Title must not exceed 100 characters'
    return
  }

  errors.value.title = ''
}

const validateDescription = () => {
  const description = formData.value.description.trim()
  
  if (!description) {
    errors.value.description = ''
    return
  }

  if (description.length < 10) {
    errors.value.description = 'Description must be at least 10 characters long'
    return
  }

  if (description.length > 500) {
    errors.value.description = 'Description must not exceed 500 characters'
    return
  }

  errors.value.description = ''
}

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.title.trim() &&
    formData.value.description.trim() &&
    !errors.value.title &&
    !errors.value.description &&
    formData.value.title.length >= 3 &&
    formData.value.description.length >= 10
  )
})

// Handle form submission
const handleCreatePost = async () => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    apiError.value = 'You must be logged in to create a post. Redirecting to sign in...'
    setTimeout(() => {
      router.push('/signin')
    }, 2000)
    return
  }

  if (!isFormValid.value) return

  isLoading.value = true
  apiError.value = ''

  try {
    // Validate form one more time
    validateTitle()
    validateDescription()

    if (errors.value.title || errors.value.description) {
      return
    }

    // Prepare post data
    const postData: CreatePostData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      allowComments: formData.value.allowComments,
      allowShares: formData.value.allowShares,
      isPublic: formData.value.privacy === 'public',
      privacy: formData.value.privacy,
      tags: formData.value.tags?.filter(tag => tag.trim()) || []
    }
    
    // Create post via API
    const createdPost = await postsApi.create(postData)
    createdPostId.value = createdPost._id
    
    console.log('Post created successfully:', createdPost)
    
    showSuccess.value = true
    
    // Clear draft after successful creation
    localStorage.removeItem('postDraft')
    
  } catch (error: any) {
    console.error('Create post error:', error)
    
    if (error.response?.data?.message) {
      apiError.value = error.response.data.message
    } else if (error.response?.data?.error) {
      apiError.value = error.response.data.error
    } else if (error.message) {
      apiError.value = error.message
    } else {
      apiError.value = 'Failed to create post. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Save as draft
const saveDraft = () => {
  console.log('Saving draft:', formData.value)
  localStorage.setItem('postDraft', JSON.stringify(formData.value))
  
  // Show a toast notification (you can implement a proper toast system)
  alert('Draft saved successfully!')
}

// Load draft on component mount
const loadDraft = () => {
  const draft = localStorage.getItem('postDraft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      formData.value = { ...formData.value, ...draftData }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
  }
}

// Success modal actions
const viewPost = () => {
  showSuccess.value = false
  if (createdPostId.value) {
    router.push(`/post/${createdPostId.value}`)
  } else {
    router.push('/')
  }
}

const createAnother = () => {
  showSuccess.value = false
  // Reset form
  formData.value = {
    title: '',
    description: '',
    allowComments: true,
    allowShares: true,
    isPublic: true,
    privacy: 'public',
    tags: []
  }
  errors.value = {
    title: '',
    description: ''
  }
  createdPostId.value = ''
  // Clear draft
  localStorage.removeItem('postDraft')
}

// Lifecycle hooks
onMounted(() => {
  // Check if user is authenticated on mount
  if (!isAuthenticated.value) {
    console.log('User not authenticated, redirecting to signin')
    router.push('/signin')
    return
  }
  
  loadDraft()
})
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Custom checkbox styles */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6 9.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Text overflow fixes */
.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .max-w-2xl {
    max-width: 100%;
  }
  
  .sm\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>