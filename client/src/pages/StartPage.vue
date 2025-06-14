<template>
  <div class="relative">
    <!-- Hero Section -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left side - Content -->
        <div class="text-center lg:text-left">
          <h1 class="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Connect,
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
              Share,
            </span>
            Inspire
          </h1>
          <p class="text-xl text-white/80 mb-8 max-w-lg">
            Join millions of creators sharing their moments, stories, and passions. 
            Your next viral moment starts here.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              label="Get Started Free" 
              class="bg-gradient-to-r from-pink-500 to-violet-500 border-0 text-lg px-8 py-3 hover:shadow-lg hover:shadow-pink-500/25"
              size="large"
            />
            <Button 
              label="Watch Demo" 
              icon="pi pi-play"
              class="p-button-outlined border-white/30 text-white hover:bg-white/10"
              size="large"
            />
          </div>

          <!-- Stats -->
          <div class="flex justify-center lg:justify-start space-x-8 mt-12">
            <div class="text-center">
              <div class="text-3xl font-bold text-white">10M+</div>
              <div class="text-white/60">Active Users</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">500K+</div>
              <div class="text-white/60">Daily Posts</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">1B+</div>
              <div class="text-white/60">Interactions</div>
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
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-white mb-4">Why Choose Vibe?</h2>
        <p class="text-white/70 text-lg">Experience social media like never before</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="feature in features" :key="feature.id" class="feature-card">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
          <p class="text-white/70">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'

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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
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