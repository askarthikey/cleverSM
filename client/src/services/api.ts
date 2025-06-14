import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // Handle specific error cases with proper null checks
    const status = error.response?.status;
    
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem('auth_token', newAccessToken);
          
          // Update the authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        console.warn('🔑 Token refresh failed - redirecting to signin');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to signin if not already there
        if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
          window.location.href = '/signin';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    if (status === 401) {
      // Token refresh failed or no refresh token available
      console.warn('🔑 Authentication failed - redirecting to signin');
      
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Redirect to signin page
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    } else if (status === 403) {
      // Forbidden
      console.warn('🚫 Access forbidden');
    } else if (status === 404) {
      // Not found
      console.warn('📭 Resource not found');
    } else if (status && status >= 500) {
      // Server error
      console.error('🔥 Server error');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('⏰ Request timeout');
    } else if (!error.response) {
      // Network error
      console.error('🌐 Network error');
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
      }
    }
    return null;
  },

  // Set auth token
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  // Set user data
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Handle API error and extract message
  getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    // Default error messages based on status code
    const status = error.response?.status;
    
    if (!status) {
      return 'Network error. Please check your connection.';
    }
    
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access forbidden. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. Resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Server is temporarily unavailable.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  },

  // Create form data for file uploads
  createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item);
            } else {
              formData.append(`${key}[${index}]`, String(item));
            }
          });
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    return formData;
  },

  // Type guard to check if error is an AxiosError
  isAxiosError(error: any): error is AxiosError {
    return error && error.isAxiosError === true;
  },

  // Get status code safely
  getStatusCode(error: any): number | undefined {
    if (this.isAxiosError(error)) {
      return error.response?.status;
    }
    return undefined;
  },

  // Check if error is a network error
  isNetworkError(error: any): boolean {
    return this.isAxiosError(error) && !error.response;
  },

  // Check if error is a timeout error
  isTimeoutError(error: any): boolean {
    return this.isAxiosError(error) && error.code === 'ECONNABORTED';
  }
};

// Export the configured axios instance as default
export default api;

// Export types for better TypeScript support
export type { AxiosResponse, AxiosError };

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    FOLLOWERS: '/users/followers',
    FOLLOWING: '/users/following',
  },
  
  // Post endpoints
  POSTS: {
    BASE: '/posts',
    BY_USER: (userId: string) => `/posts/user/${userId}`,
    BY_ID: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    SHARE: (id: string) => `/posts/${id}/share`,
    COMMENTS: (id: string) => `/posts/${id}/comments`,
    SEARCH: '/posts/search',
    TRENDING: '/posts/trending',
    BY_TAG: '/posts/tag',
  },
  
  // Media endpoints
  MEDIA: {
    UPLOAD: '/media/upload',
    DELETE: (id: string) => `/media/${id}`,
  }
} as const;