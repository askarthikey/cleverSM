import api from './api'

export interface Notification {
  _id: string
  recipientId: string
  senderId: string
  senderUsername: string
  type: 'follow_request' | 'follow_accepted' | 'follow_rejected' | 'like' | 'comment' | 'share'
  message: string
  data?: {
    postId?: string
    commentId?: string
    followRequestId?: string
  }
  isRead: boolean
  createdAt: string
  updatedAt: string
  fromUser?: {
    _id: string
    username: string
    profilePicture?: string
  }
  metadata?: {
    followRequestId?: string
    postId?: string
    commentId?: string
  }
}

export interface FollowRequest {
  _id: string
  senderId: string
  senderUsername: string
  recipientId: string
  recipientUsername: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  createdAt: string
  updatedAt: string
  fromUser: {
    _id: string
    username: string
    profilePicture?: string
  }
  toUser: string
}

export const notificationService = {
  // Get all notifications for the current user
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications')
    return response.data.data.notifications
  },

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count')
    return response.data.data.count
  },

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`)
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all')
  },

  // Send a follow request
  async sendFollowRequest(toUserId: string): Promise<void> {
    try {
      // First we need to get the target user's username
      const userResponse = await api.get(`/users/${toUserId}`)
      const targetUsername = userResponse.data.username
      
      await api.post('/notifications/follow-request', { 
        recipientId: toUserId,
        recipientUsername: targetUsername
      })
    } catch (error) {
      console.error('Error sending follow request:', error)
      throw error
    }
  },

  // Cancel a follow request
  async cancelFollowRequest(toUserId: string): Promise<void> {
    await api.delete(`/notifications/follow-request/${toUserId}`)
  },

  // Accept a follow request
  async acceptFollowRequest(requestId: string): Promise<void> {
    await api.post(`/notifications/follow-requests/${requestId}/accept`)
  },

  // Reject a follow request
  async rejectFollowRequest(requestId: string): Promise<void> {
    await api.post(`/notifications/follow-requests/${requestId}/reject`)
  },

  // Get pending follow requests
  async getPendingFollowRequests(): Promise<FollowRequest[]> {
    const response = await api.get('/notifications/follow-requests/pending')
    return response.data.data
  }
}
