import api from './api'

export interface User {
  _id: string
  username: string
  email?: string
  phone?: string
  profilePicture?: string
  bio?: string
  followers: string[]
  following: string[]
  isVerified: boolean
  isFollowing?: boolean
  followRequestSent?: boolean
  createdAt: string
  updatedAt: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  totalPages: number
}

export interface FollowResponse {
  success: boolean
  message: string
  isFollowing: boolean
}

export const usersApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile')
    return response.data
  },

  // Search users by username
  searchUsers: async (query: string, page: number = 1, limit: number = 20): Promise<UsersResponse> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    return response.data
  },

  // Get user suggestions (users not followed yet)
  getUserSuggestions: async (page: number = 1, limit: number = 20): Promise<UsersResponse> => {
    const response = await api.get(`/users/suggestions?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get users the current user is following
  getFollowing: async (page: number = 1, limit: number = 20): Promise<UsersResponse> => {
    const response = await api.get(`/users/following?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get users following the current user
  getFollowers: async (page: number = 1, limit: number = 20): Promise<UsersResponse> => {
    const response = await api.get(`/users/followers?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Get user by username
  getUserByUsername: async (username: string): Promise<User> => {
    try {
      // Use search endpoint to find user by exact username match
      const response = await usersApi.searchUsers(username, 1, 10)
      const matchingUser = response.users.find(user => 
        user.username.toLowerCase() === username.toLowerCase()
      )
      
      if (!matchingUser) {
        throw new Error(`User with username "${username}" not found`)
      }
      
      return matchingUser
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        throw error
      }
      throw new Error(`Failed to find user with username "${username}"`)
    }
  },

  // Follow a user
  followUser: async (userId: string): Promise<FollowResponse> => {
    try {
      const response = await api.post(`/users/${userId}/follow`)
      return response.data
    } catch (error: any) {
      console.error('Error following user:', error)
      
      if (error?.response?.status === 409) {
        throw new Error('Already following this user')
      } else if (error?.response?.status === 404) {
        throw new Error('User not found')
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to continue')
      }
      
      throw error
    }
  },

  // Unfollow a user
  unfollowUser: async (userId: string): Promise<FollowResponse> => {
    try {
      const response = await api.delete(`/users/${userId}/follow`)
      return response.data
    } catch (error: any) {
      console.error('Error unfollowing user:', error)
      
      if (error?.response?.status === 404) {
        throw new Error('User not found')
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to continue')
      }
      
      throw error
    }
  },

  // Get follow status between current user and target user
  getFollowStatus: async (userId: string): Promise<{
    isFollowing: boolean;
    followRequestSent: boolean;
    hasFollowRequest: boolean;
  }> => {
    try {
      const response = await api.get(`/users/${userId}/follow-status`)
      return response.data.data
    } catch (error: any) {
      console.error('Error getting follow status:', error)
      return {
        isFollowing: false,
        followRequestSent: false,
        hasFollowRequest: false
      }
    }
  }
}
