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

  // Follow a user
  followUser: async (userId: string): Promise<FollowResponse> => {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
  },

  // Unfollow a user
  unfollowUser: async (userId: string): Promise<FollowResponse> => {
    const response = await api.delete(`/users/${userId}/follow`)
    return response.data
  }
}
