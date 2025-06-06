import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
    apiClient.post('/login', data),
    
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    apiClient.post('/register', data),
    
  logout: (): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.post('/logout'),
};

// User API
export const userAPI = {
  getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.get('/me'),
    
  updateProfile: (data: UpdateProfileData): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.put('/me', data),
};

// Admin API
export const adminAPI = {
  getUsers: (): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    apiClient.get('/users'),

  createUser: (data: CreateUserData): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.post('/users', data),
    
  getUser: (id: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.get(`/users/${id}`),
    
  updateUser: (id: number, data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.put(`/users/${id}`, data),
    
  deleteUser: (id: number): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.delete(`/users/${id}`),
};

// Helper functions
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default apiClient;
