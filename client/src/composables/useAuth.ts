import { ref, computed } from 'vue'
import { authService, type User } from '../services/auth'

const user = ref<User | null>(authService.getStoredUser())
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const logout = () => {
    authService.logout()
    user.value = null
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    setUser,
    logout
  }
}