// import axios, { AxiosResponse } from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:9000/api';

// // Types
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'user';
//   created_at: string;
//   updated_at: string;
// }

// export interface LoginData {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
// }

// export interface UpdateProfileData {
//   name: string;
//   email: string;
//   current_password?: string;
//   password?: string;
//   password_confirmation?: string;
// }

// export interface CreateUserData {
//   name: string;
//   email: string;
//   password: string;
//   role: 'admin' | 'user';
// }

// export interface AuthResponse {
//   data: User;
//   token: string;
//   message?: string;
// }

// export interface ApiResponse<T> {
//   data: T;
//   message?: string;
// }

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Request interceptor to add token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle authentication errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
//     apiClient.post('/login', data),
    
//   register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
//     apiClient.post('/register', data),
    
//   logout: (): Promise<AxiosResponse<{ message: string }>> =>
//     apiClient.post('/logout'),
// };

// // User API
// export const userAPI = {
//   getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> =>
//     apiClient.get('/me'),
    
//   updateProfile: (data: UpdateProfileData): Promise<AxiosResponse<ApiResponse<User>>> =>
//     apiClient.put('/me', data),
// };

// // Admin API
// export const adminAPI = {
//   getUsers: (): Promise<AxiosResponse<ApiResponse<User[]>>> =>
//     apiClient.get('/users'),

//   createUser: (data: CreateUserData): Promise<AxiosResponse<ApiResponse<User>>> =>
//     apiClient.post('/users', data),
    
//   getUser: (id: number): Promise<AxiosResponse<ApiResponse<User>>> =>
//     apiClient.get(`/users/${id}`),
    
//   updateUser: (id: number, data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
//     apiClient.put(`/users/${id}`, data),
    
//   deleteUser: (id: number): Promise<AxiosResponse<{ message: string }>> =>
//     apiClient.delete(`/users/${id}`),
// };

// // Helper functions
// export const getCurrentUser = (): User | null => {
//   const userStr = localStorage.getItem('user');
//   return userStr ? JSON.parse(userStr) : null;
// };

// export const isAuthenticated = (): boolean => {
//   return !!localStorage.getItem('token');
// };

// export const isAdmin = (): boolean => {
//   const user = getCurrentUser();
//   return user?.role === 'admin';
// };

// export const logout = (): void => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// };

// export default apiClient;

import axios, { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:9000/api';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  data: User;
  token: string;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors and other issues
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      
      // Don't handle extension-related errors
      if (error.message?.includes('message channel closed') || 
          error.message?.includes('Extension context invalidated')) {
        console.warn('Browser extension error detected, ignoring:', error.message);
        return Promise.resolve({ data: null }); // Return empty response for extension errors
      }
      
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        original: error
      });
    }

    // Handle HTTP errors
    if (error.response?.status === 401) {
      console.warn('Authentication failed, clearing session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }

    return Promise.reject(error);
  }
);

// Enhanced API call wrapper with retry logic
const apiCall = async <T>(apiFunction: () => Promise<AxiosResponse<T>>, retries = 1): Promise<AxiosResponse<T>> => {
  try {
    return await apiFunction();
  } catch (error: any) {
    // Don't retry for extension errors
    if (error?.message?.includes('message channel closed') || 
        error?.message?.includes('Extension context invalidated')) {
      console.warn('Extension error detected, not retrying');
      throw error;
    }

    // Retry for network errors
    if (retries > 0 && (!error.response || error.code === 'NETWORK_ERROR')) {
      console.log(`Retrying API call... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return apiCall(apiFunction, retries - 1);
    }
    
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
    apiCall(() => apiClient.post('/login', data)),
    
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    apiCall(() => apiClient.post('/register', data)),
    
  logout: (): Promise<AxiosResponse<{ message: string }>> =>
    apiCall(() => apiClient.post('/logout')),
};

// User API
export const userAPI = {
  getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiCall(() => apiClient.get('/me')),
    
  updateProfile: (data: UpdateProfileData): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiCall(() => apiClient.put('/me', data)),
};

// Admin API
export const adminAPI = {
  getUsers: (): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    apiCall(() => apiClient.get('/users')),

  createUser: (data: CreateUserData): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiCall(() => apiClient.post('/users', data)),
    
  getUser: (id: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiCall(() => apiClient.get(`/users/${id}`)),
    
  updateUser: (id: number, data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiCall(() => apiClient.put(`/users/${id}`, data)),
    
  deleteUser: (id: number): Promise<AxiosResponse<{ message: string }>> =>
    apiCall(() => apiClient.delete(`/users/${id}`)),
};

// Enhanced helper functions with error handling
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user'); // Clean up corrupted data
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem('token');
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const isAdmin = (): boolean => {
  try {
    const user = getCurrentUser();
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const logout = (): void => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Add global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Ignore extension-related errors
    if (event.reason?.message?.includes('message channel closed') ||
        event.reason?.message?.includes('Extension context invalidated')) {
      console.warn('Browser extension error caught and ignored:', event.reason?.message);
      event.preventDefault(); // Prevent the error from showing in console
      return;
    }
    
    console.error('Unhandled promise rejection:', event.reason);
  });
}

export default apiClient;