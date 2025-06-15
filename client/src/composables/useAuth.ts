import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
}

// Create global reactive state outside the composable
const user = ref<User | null>(null)
const token = ref<string | null>(null)
const isLoading = ref(false)

// Initialize auth state from storage immediately
const initializeAuth = () => {
  // Check both localStorage and sessionStorage for auth data
  let storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  let storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  
  if (storedToken && storedUser) {
    token.value = storedToken
    try {
      user.value = JSON.parse(storedUser)
      console.log('Auth state restored from storage:', { user: user.value, hasToken: !!token.value })
    } catch (error) {
      console.error('Failed to parse stored user:', error)
      // Clear invalid data from both storages
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('user')
      user.value = null
      token.value = null
    }
  } else {
    console.log('No auth data found in storage')
  }
}

// Initialize immediately when the module loads
initializeAuth()

export const useAuth = () => {
  const router = useRouter()

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    try {
      // Your login API call here
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Update global state
      token.value = data.token
      user.value = data.user
      
      // Persist to localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      console.log('Login successful, auth state updated:', { user: user.value, hasToken: !!token.value })
      
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    // Clear auth data from both localStorage and sessionStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('refresh_token')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('refresh_token')
    console.log('User logged out, auth state cleared from all storage')
    // Don't automatically redirect here, let the calling component handle it
  }

  const setUser = (userData: User, authToken?: string, rememberMe: boolean = false) => {
    user.value = userData
    
    // Choose storage based on rememberMe preference
    const storage = rememberMe ? localStorage : sessionStorage
    
    if (authToken) {
      token.value = authToken
      storage.setItem('auth_token', authToken)
      
      // Clear from the other storage to avoid conflicts
      const otherStorage = rememberMe ? sessionStorage : localStorage
      otherStorage.removeItem('auth_token')
    }
    
    storage.setItem('user', JSON.stringify(userData))
    
    // Clear from the other storage to avoid conflicts
    const otherStorage = rememberMe ? sessionStorage : localStorage
    otherStorage.removeItem('user')
    
    console.log('User set in auth state:', { 
      user: userData, 
      hasToken: !!token.value, 
      storage: rememberMe ? 'localStorage' : 'sessionStorage' 
    })
  }

  const isAuthenticated = computed(() => {
    const authenticated = !!user.value && !!token.value
    console.log('Auth check:', { hasUser: !!user.value, hasToken: !!token.value, authenticated })
    return authenticated
  })

  // Refresh auth state from localStorage (useful for debugging)
  const refreshAuth = () => {
    initializeAuth()
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    setUser,
    refreshAuth
  }
}