import api from './api';

export interface CreatePostData {
  title: string;
  description: string;
  allowComments?: boolean;
  allowShares?: boolean;
  isPublic?: boolean;
  privacy?: 'public' | 'followers' | 'friends' | 'private';
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  allowComments?: boolean;
  allowShares?: boolean;
  isPublic?: boolean;
  privacy?: 'public' | 'followers' | 'friends' | 'private';
  tags?: string[];
}

export interface PostAuthor {
  _id: string;
  username: string;
  profilePicture?: string;
}

export interface Comment {
  _id: string;
  author: string;
  authorUsername: string;
  content: string;
  likes: string[];
  likesCount: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  _id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  author: PostAuthor;
  likes: string[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  shares: string[];
  sharesCount: number;
  allowComments: boolean;
  allowShares: boolean;
  isPublic: boolean;
  privacy: 'public' | 'followers' | 'friends' | 'private';
  tags?: string[];
  media?: MediaItem[];
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isShared?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface ShareResponse {
  shared: boolean;
  sharesCount: number;
}

export interface CreateCommentData {
  content: string;
  parentCommentId?: string;
}

// Utility function to handle API requests with retry logic
const handleApiRequest = async <T>(
  requestFn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry for certain error types
      if (error.response?.status === 401 || 
          error.response?.status === 403 || 
          error.response?.status === 404 ||
          error.response?.status === 422) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (i === retries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError;
};

export const postsApi = {
  // Create a new post
  create: async (postData: CreatePostData): Promise<Post> => {
    try {
      if (!postData.title?.trim()) {
        throw new Error('Post title is required');
      }
      if (!postData.description?.trim()) {
        throw new Error('Post description is required');
      }
      
      const response = await api.post<ApiResponse<Post>>('/posts', postData);
      return response.data.data;
    } catch (error: any) {
      console.error('Create post error:', error);
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid post data');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in to create a post');
      } else if (error.response?.status === 413) {
        throw new Error('Post content is too large');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message ||
        'Failed to create post'
      );
    }
  },

  // Get all posts with pagination and filtering
  getAll: async (
    page = 1, 
    limit = 10, 
    privacy = 'public'
  ): Promise<PostsResponse> => {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;
      
      const response = await api.get<ApiResponse<PostsResponse>>('/posts', {
        params: { page, limit, privacy }
      });
      
      return response.data.data;
    } catch (error: any) {
      console.error('Get posts error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please log in to view posts');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message ||
        'Failed to fetch posts'
      );
    }
  },

  // Get personalized feed (posts from followed users + own posts)
  getFeed: async (
    page = 1, 
    limit = 10
  ): Promise<PostsResponse> => {
    return handleApiRequest(async () => {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;
      
      try {
        const response = await api.get<ApiResponse<PostsResponse>>('/posts/feed', {
          params: { page, limit }
        });
        return response.data.data;
      } catch (error: any) {
        console.error('Get feed error:', error);
        
        if (error.response?.status === 401) {
          throw new Error('Please log in to view your feed');
        } else if (error.response?.status === 404) {
          // Return empty feed if no posts found
          return {
            posts: [],
            total: 0,
            page: 1,
            totalPages: 0
          };
        }
        
        throw new Error(
          error.response?.data?.message || 
          error.message ||
          'Failed to fetch feed'
        );
      }
    });
  },

  // Get post by ID
  getById: async (id: string): Promise<Post> => {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }
      
      const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Get post by ID error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch post'
      );
    }
  },

  // Get posts by user with pagination
  getByUser: async (
    userId: string, 
    page = 1, 
    limit = 10
  ): Promise<PostsResponse> => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const response = await api.get<ApiResponse<PostsResponse>>(`/posts/user/${userId}`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Get user posts error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch user posts'
      );
    }
  },

  // Update post
  update: async (id: string, postData: UpdatePostData): Promise<Post> => {
    try {
      if (!id?.trim()) {
        throw new Error('Post ID is required');
      }
      
      // Validate at least one field is being updated
      const hasUpdates = Object.values(postData).some(value => 
        value !== undefined && value !== null && value !== ''
      );
      
      if (!hasUpdates) {
        throw new Error('At least one field must be updated');
      }
      
      const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, postData);
      return response.data.data;
    } catch (error: any) {
      console.error('Update post error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Post not found');
      } else if (error.response?.status === 403) {
        throw new Error('You can only edit your own posts');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in to edit posts');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message ||
        'Failed to update post'
      );
    }
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }
      
      await api.delete(`/posts/${id}`);
    } catch (error: any) {
      console.error('Delete post error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete post'
      );
    }
  },

  // Like/unlike post
  like: async (id: string): Promise<LikeResponse> => {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }
      
      const response = await api.post<ApiResponse<LikeResponse>>(`/posts/${id}/like`);
      return response.data.data;
    } catch (error: any) {
      console.error('Like post error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to like/unlike post'
      );
    }
  },

  // Share/unshare post
  share: async (id: string): Promise<ShareResponse> => {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }
      
      const response = await api.post<ApiResponse<ShareResponse>>(`/posts/${id}/share`);
      return response.data.data;
    } catch (error: any) {
      console.error('Share post error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to share/unshare post'
      );
    }
  },

  // Add comment to post
  addComment: async (id: string, commentData: CreateCommentData): Promise<Comment> => {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }
      
      if (!commentData.content?.trim()) {
        throw new Error('Comment content is required');
      }
      
      const response = await api.post<ApiResponse<Comment>>(`/posts/${id}/comments`, commentData);
      return response.data.data;
    } catch (error: any) {
      console.error('Add comment error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to add comment'
      );
    }
  },

  // Delete comment from post
  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }
      
      if (!commentId) {
        throw new Error('Comment ID is required');
      }
      
      await api.delete(`/posts/${postId}/comments/${commentId}`);
    } catch (error: any) {
      console.error('Delete comment error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete comment'
      );
    }
  },

  // Get comments for a post
  getComments: async (
    id: string, 
    page = 1, 
    limit = 10
  ): Promise<CommentsResponse> => {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }
      
      const response = await api.get<ApiResponse<CommentsResponse>>(`/posts/${id}/comments`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Get comments error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch comments'
      );
    }
  },

  // Search posts
  search: async (
    query: string, 
    page = 1, 
    limit = 10
  ): Promise<PostsResponse> => {
    try {
      if (!query?.trim()) {
        throw new Error('Search query is required');
      }
      
      const response = await api.get<ApiResponse<PostsResponse>>('/posts/search', {
        params: { q: query.trim(), page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Search posts error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to search posts'
      );
    }
  },

  // Get trending posts
  getTrending: async (page = 1, limit = 10): Promise<PostsResponse> => {
    try {
      const response = await api.get<ApiResponse<PostsResponse>>('/posts/trending', {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Get trending posts error:', error);
      // Fallback to regular posts if trending endpoint doesn't exist
      if (error.response?.status === 404) {
        return postsApi.getAll(page, limit, 'public');
      }
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch trending posts'
      );
    }
  },

  // Get posts by tag
  getByTag: async (
    tag: string, 
    page = 1, 
    limit = 10
  ): Promise<PostsResponse> => {
    try {
      if (!tag?.trim()) {
        throw new Error('Tag is required');
      }
      
      const response = await api.get<ApiResponse<PostsResponse>>('/posts/tag', {
        params: { tag: tag.trim(), page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Get posts by tag error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch posts by tag'
      );
    }
  },

  // Batch like multiple posts (useful for offline sync)
  batchLike: async (postIds: string[]): Promise<{ success: string[], failed: string[] }> => {
    const results: { success: string[], failed: string[] } = { 
      success: [], 
      failed: [] 
    };
    
    for (const postId of postIds) {
      try {
        await postsApi.like(postId);
        results.success.push(postId);
      } catch (error) {
        console.error(`Failed to like post ${postId}:`, error);
        results.failed.push(postId);
      }
    }
    
    return results;
  },

  // Check if posts service is available
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get('/posts', { params: { page: 1, limit: 1 } });
      return response.status === 200;
    } catch (error) {
      console.warn('Posts service health check failed:', error);
      return false;
    }
  }
};

// Export default for convenience
export default postsApi;

// Utility functions for working with posts
export const postUtils = {
  // Check if user has liked a post
  isLikedByUser: (post: Post, userId: string): boolean => {
    return post.likes.includes(userId) || post.isLiked === true;
  },

  // Check if user has shared a post
  isSharedByUser: (post: Post, userId: string): boolean => {
    return post.shares.includes(userId) || post.isShared === true;
  },

  // Check if user can edit post
  canEdit: (post: Post, userId: string): boolean => {
    return post.author._id === userId;
  },

  // Check if user can delete post
  canDelete: (post: Post, userId: string): boolean => {
    return post.author._id === userId;
  },

  // Format post date
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  // Extract hashtags from text
  extractHashtags: (text: string): string[] => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  },

  // Get privacy icon
  getPrivacyIcon: (privacy: string): string => {
    switch (privacy) {
      case 'public':
        return '🌍';
      case 'followers':
        return '👥';
      case 'friends':
        return '👫';
      case 'private':
        return '🔒';
      default:
        return '🌍';
    }
  },

  // Get privacy label
  getPrivacyLabel: (privacy: string): string => {
    switch (privacy) {
      case 'public':
        return 'Public';
      case 'followers':
        return 'Followers';
      case 'friends':
        return 'Friends';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  }
};