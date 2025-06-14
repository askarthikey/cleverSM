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

// Initialize auth state from localStorage immediately
const initializeAuth = () => {
  const storedToken = localStorage.getItem('auth_token')
  const storedUser = localStorage.getItem('user')
  
  if (storedToken && storedUser) {
    token.value = storedToken
    try {
      user.value = JSON.parse(storedUser)
      console.log('Auth state restored from localStorage:', { user: user.value, hasToken: !!token.value })
    } catch (error) {
      console.error('Failed to parse stored user:', error)
      // Clear invalid data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      user.value = null
      token.value = null
    }
  } else {
    console.log('No auth data found in localStorage')
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
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    console.log('User logged out, auth state cleared')
    router.push('/signin')
  }

  const setUser = (userData: User, authToken?: string) => {
    user.value = userData
    if (authToken) {
      token.value = authToken
      localStorage.setItem('auth_token', authToken)
    }
    localStorage.setItem('user', JSON.stringify(userData))
    console.log('User set in auth state:', { user: userData, hasToken: !!token.value })
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