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
              <!-- Character count -->
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
              <!-- Character count for description -->
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

          <!-- Post Preview -->
          <div v-if="formData.title || formData.description" class="space-y-2">
            <label class="text-white font-semibold text-sm flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>Preview</span>
            </label>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <!-- User Avatar -->
                <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-sm font-bold">
                    {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <!-- User Info -->
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-white font-semibold">{{ user?.username || 'Your Username' }}</span>
                    <span class="text-white/50 text-sm">• now</span>
                    <!-- Privacy indicator -->
                    <div class="flex items-center space-x-1">
                      <component 
                        :is="getPrivacyIcon(formData.privacy as PrivacyType)" 
                        class="w-3 h-3" 
                      />
                      <span class="text-white/50 text-xs">{{ privacySettings[formData.privacy as PrivacyType].label }}</span>
                    </div>
                  </div>
                  
                  <!-- Post Content with proper overflow handling -->
                  <div class="space-y-2">
                    <h3 v-if="formData.title" class="text-white font-semibold text-lg break-words">
                      {{ formData.title }}
                    </h3>
                    <div v-if="formData.description" class="text-white/80 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {{ formData.description }}
                    </div>
                    <div v-if="!formData.title && !formData.description" class="text-white/40 italic">
                      Your post preview will appear here...
                    </div>
                  </div>

                  <!-- Post Actions Preview -->
                  <div class="flex items-center space-x-6 mt-4 pt-3 border-t border-white/10">
                    <button type="button" class="flex items-center space-x-2 text-white/60 hover:text-pink-400 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span class="text-sm">Like</span>
                    </button>
                    <button type="button" class="flex items-center space-x-2 text-white/60 hover:text-blue-400 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span class="text-sm">Comment</span>
                    </button>
                    <button type="button" class="flex items-center space-x-2 text-white/60 hover:text-green-400 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                      </svg>
                      <span class="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
              <!-- Privacy Setting with Dropdown -->
              <div class="bg-white/5 border border-white/10 rounded-xl p-4 relative" ref="privacyDropdownRef">
                <button
                  type="button"
                  @click="showPrivacyDropdown = !showPrivacyDropdown"
                  class="w-full flex items-center justify-between text-left hover:bg-white/5 transition-colors rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <component 
                      :is="getPrivacyIcon(formData.privacy as PrivacyType)" 
                      class="w-4 h-4" 
                    />
                    <div>
                      <div class="text-white font-medium text-sm">{{ privacySettings[formData.privacy as PrivacyType].label }}</div>
                      <div class="text-white/60 text-xs">{{ privacySettings[formData.privacy as PrivacyType].description }}</div>
                    </div>
                  </div>
                  <svg 
                    class="w-4 h-4 text-white/50 transition-transform"
                    :class="{ 'rotate-180': showPrivacyDropdown }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Privacy Dropdown -->
                <div 
                  v-if="showPrivacyDropdown"
                  class="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg z-50"
                >
                  <div class="p-2 space-y-1">
                    <button
                      v-for="(setting, key) in privacySettings"
                      :key="key"
                      type="button"
                      @click="selectPrivacy(key)"
                      class="w-full flex items-center space-x-3 p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                      :class="{ 'bg-white/10': formData.privacy === key }"
                    >
                      <component :is="getPrivacyIcon(key)" class="w-4 h-4" />
                      <div>
                        <div class="text-white font-medium text-sm">{{ setting.label }}</div>
                        <div class="text-white/60 text-xs">{{ setting.description }}</div>
                      </div>
                      <svg v-if="formData.privacy === key" class="w-4 h-4 text-green-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

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
                  <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                </div>
              </div>

              <!-- Notify on Interactions -->
              <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <div class="flex items-center space-x-3">
                  <input
                    id="notifyInteractions"
                    v-model="formData.notifyInteractions"
                    type="checkbox"
                    class="w-4 h-4 text-pink-500 bg-white/10 border-white/20 rounded focus:ring-pink-500"
                  />
                  <div class="flex-1">
                    <label for="notifyInteractions" class="text-white font-medium text-sm cursor-pointer">
                      Notify on Interactions
                    </label>
                    <div class="text-white/60 text-xs">Get notified about likes and comments</div>
                  </div>
                  <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h5M4 15h3m0-4h2l2-2m0 0l2-2m-2 2l-2-2m2 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6h6z"></path>
                  </svg>
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
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user } = useAuth()

// Define privacy types
type PrivacyType = 'public' | 'followers' | 'friends' | 'private'

// Privacy icon components using render functions
const GlobeIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-4 h-4 text-green-400',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
      })
    ])
  }
})

const UsersIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-4 h-4 text-blue-400',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
      })
    ])
  }
})

const UserPlusIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-4 h-4 text-purple-400',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      })
    ])
  }
})

const LockIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-4 h-4 text-red-400',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
      })
    ])
  }
})

// Privacy settings configuration with proper typing
const privacySettings: Record<PrivacyType, { label: string; description: string }> = {
  public: {
    label: 'Public',
    description: 'Anyone can see this post'
  },
  followers: {
    label: 'Followers Only',
    description: 'Only your followers can see this'
  },
  friends: {
    label: 'Friends Only',
    description: 'Only your friends can see this'
  },
  private: {
    label: 'Only Me',
    description: 'Only you can see this post'
  }
}

// Helper function to get privacy icon
const getPrivacyIcon = (privacy: PrivacyType) => {
  const iconMap = {
    public: GlobeIcon,
    followers: UsersIcon,
    friends: UserPlusIcon,
    private: LockIcon
  }
  return iconMap[privacy]
}

// Form data
const formData = ref({
  title: '',
  description: '',
  privacy: 'public' as PrivacyType,
  allowComments: true,
  allowShares: true,
  notifyInteractions: true
})

// Form state
const isLoading = ref(false)
const showSuccess = ref(false)
const showPrivacyDropdown = ref(false)
const apiError = ref('')
const privacyDropdownRef = ref<HTMLElement>()

// Errors
const errors = ref({
  title: '',
  description: ''
})

// Privacy selection
const selectPrivacy = (privacy: PrivacyType) => {
  formData.value.privacy = privacy
  showPrivacyDropdown.value = false
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (privacyDropdownRef.value && !privacyDropdownRef.value.contains(event.target as Node)) {
    showPrivacyDropdown.value = false
  }
}

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

    // Here you would make the API call to create the post
    const postData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      privacy: formData.value.privacy,
      allowComments: formData.value.allowComments,
      allowShares: formData.value.allowShares,
      notifyInteractions: formData.value.notifyInteractions
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Post created:', {
      ...postData,
      author: user.value?.username
    })
    
    showSuccess.value = true
    
  } catch (error: any) {
    console.error('Create post error:', error)
    apiError.value = error.message || 'Failed to create post. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Save as draft
const saveDraft = () => {
  console.log('Saving draft:', formData.value)
  localStorage.setItem('postDraft', JSON.stringify(formData.value))
  
  // Show a toast notification
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
  router.push('/')
}

const createAnother = () => {
  showSuccess.value = false
  // Reset form
  formData.value = {
    title: '',
    description: '',
    privacy: 'public',
    allowComments: true,
    allowShares: true,
    notifyInteractions: true
  }
  errors.value = {
    title: '',
    description: ''
  }
  // Clear draft
  localStorage.removeItem('postDraft')
}

// Lifecycle hooks
onMounted(() => {
  loadDraft()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

/* Dropdown animations */
.rotate-180 {
  transform: rotate(180deg);
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