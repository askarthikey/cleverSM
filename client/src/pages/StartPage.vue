<template>
  <div class="relative min-h-screen">
    <!-- Hero Section -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left side - Content -->
        <div class="text-center lg:text-left space-y-8">
          <div class="space-y-6">
            <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight">
              Connect,
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400 animate-pulse">
                Share,
              </span>
              <span class="block">Inspire</span>
            </h1>
            <p class="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-2xl font-light">
              Join millions of creators sharing their moments, stories, and passions. 
              <span class="text-pink-300 font-medium">Your next viral moment starts here.</span>
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
            <Button 
              label="Get Started Free" 
              class="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 border-0 text-white text-lg font-semibold px-10 py-4 hover:shadow-2xl hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300 rounded-2xl"
              size="large"
              @click="goToSignUp"
            />
            <Button 
              label="Sign In" 
              icon="pi pi-sign-in"
              class="p-button-outlined border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/60 text-lg font-semibold px-10 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              size="large"
              @click="goToSignIn"
            />
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto lg:mx-0">
            <div class="text-center group">
              <div class="text-3xl lg:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">10M+</div>
              <div class="text-white/70 text-sm lg:text-base font-medium mt-1">Active Users</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl lg:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">500K+</div>
              <div class="text-white/70 text-sm lg:text-base font-medium mt-1">Daily Posts</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl lg:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">1B+</div>
              <div class="text-white/70 text-sm lg:text-base font-medium mt-1">Interactions</div>
            </div>
          </div>
        </div>

        <!-- Right side - Mock Interface -->
        <div class="relative">
          <div class="mock-phone">
            <!-- Phone frame -->
            <div class="phone-frame">
              <!-- Status bar -->
              <div class="status-bar">
                <span class="time">9:41</span>
                <div class="status-icons">
                  <i class="pi pi-wifi"></i>
                  <i class="pi pi-mobile"></i>
                  <div class="battery"></div>
                </div>
              </div>

              <!-- App content -->
              <div class="app-content">
                <!-- Header -->
                <div class="app-header">
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold">For You</h2>
                    <i class="pi pi-heart text-pink-500"></i>
                  </div>
                </div>

                <!-- Posts -->
                <div class="posts-container">
                  <div v-for="post in mockPosts" :key="post.id" class="post-card">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-r" :style="{ background: post.avatar }"></div>
                      <div>
                        <div class="font-semibold text-sm">{{ post.username }}</div>
                        <div class="text-xs text-gray-500">{{ post.time }}</div>
                      </div>
                    </div>
                    <div class="post-image" :style="{ background: post.imageGradient }"></div>
                    <div class="flex items-center justify-between mt-3">
                      <div class="flex space-x-4">
                        <i class="pi pi-heart text-pink-500"></i>
                        <i class="pi pi-comment"></i>
                        <i class="pi pi-share-alt"></i>
                      </div>
                      <i class="pi pi-bookmark"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating elements -->
          <div class="floating-ui-elements">
            <div class="ui-element ui-element-1">
              <i class="pi pi-heart text-pink-500"></i>
              <span>+1.2K</span>
            </div>
            <div class="ui-element ui-element-2">
              <i class="pi pi-comment text-blue-500"></i>
              <span>423</span>
            </div>
            <div class="ui-element ui-element-3">
              <i class="pi pi-share-alt text-green-500"></i>
              <span>Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features section -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
      <div class="text-center mb-20">
        <h2 class="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Why Choose Vibe?</h2>
        <p class="text-white/80 text-xl font-light max-w-2xl mx-auto leading-relaxed">Experience social media like never before with our cutting-edge features</p>
      </div>

      <div class="grid md:grid-cols-3 gap-10">
        <div v-for="feature in features" :key="feature.id" class="feature-card group">
          <div class="feature-icon group-hover:scale-110 transition-transform duration-300">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">{{ feature.title }}</h3>
          <p class="text-white/80 leading-relaxed text-lg">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigation functions
const goToSignUp = () => {
  router.push('/signup')
}

const goToSignIn = () => {
  router.push('/signin')
}

const mockPosts = ref([
  {
    id: 1,
    username: 'sarah_creative',
    time: '2h',
    avatar: 'linear-gradient(45deg, #ff6b6b, #feca57)',
    imageGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    username: 'travel_junkie',
    time: '4h',
    avatar: 'linear-gradient(45deg, #48cae4, #023047)',
    imageGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    username: 'food_lover',
    time: '6h',
    avatar: 'linear-gradient(45deg, #06ffa5, #3d8b37)',
    imageGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
])

const features = ref([
  {
    id: 1,
    icon: 'pi pi-bolt text-yellow-400',
    title: 'Lightning Fast',
    description: 'Real-time updates and instant notifications keep you connected'
  },
  {
    id: 2,
    icon: 'pi pi-shield text-green-400',
    title: 'Privacy First',
    description: 'Your data is protected with end-to-end encryption'
  },
  {
    id: 3,
    icon: 'pi pi-palette text-purple-400',
    title: 'Creative Tools',
    description: 'Advanced editing tools to make your content stand out'
  }
])
</script>

<style scoped>
/* Mock phone styles */
.mock-phone {
  position: relative;
  margin: 0 auto;
  max-width: 300px;
}

.phone-frame {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-radius: 30px;
  padding: 8px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.battery {
  width: 20px;
  height: 10px;
  border: 1px solid white;
  border-radius: 2px;
  position: relative;
}

.battery::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 2px;
  width: 2px;
  height: 6px;
  background: white;
  border-radius: 0 1px 1px 0;
}

.app-content {
  background: linear-gradient(145deg, #000, #1a1a1a);
  border-radius: 22px;
  min-height: 500px;
  overflow: hidden;
}

.app-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.posts-container {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.post-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.post-image {
  height: 120px;
  border-radius: 12px;
  margin: 12px 0;
}

/* Floating UI elements */
.floating-ui-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.ui-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: bounce 3s infinite;
}

.ui-element-1 {
  top: 20%;
  right: -20px;
  animation-delay: 0s;
}

.ui-element-2 {
  top: 45%;
  left: -30px;
  animation-delay: 1s;
}

.ui-element-3 {
  bottom: 25%;
  right: -25px;
  animation-delay: 2s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Feature cards */
.feature-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(236, 72, 153, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .mock-phone {
    max-width: 250px;
  }
  
  .floating-ui-elements {
    display: none;
  }
}
</style>