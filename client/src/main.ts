import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Button from 'primevue/button'
import router from './router'
import './style.css'
import App from './App.vue'

// Debug localStorage on app startup
console.log('🚀 App starting up...')
console.log('Auth token in localStorage:', localStorage.getItem('auth_token'))
console.log('User in localStorage:', localStorage.getItem('user'))

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})

// Register PrimeVue components globally
app.component('Button', Button)

app.use(router)
app.mount('#app')
