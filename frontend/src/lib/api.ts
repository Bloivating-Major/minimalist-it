import axios from 'axios';
import type { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';

// Determine the correct API base URL based on current host
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // Production - check for common deployment patterns
    else if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
      // Frontend is deployed, use production backend
      return 'https://todomaster-backend.onrender.com/api';  // Replace with your actual Render URL
    }
    // Local network (mobile testing)
    else {
      return `http://${hostname}:5000/api`;
    }
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const todoApi = {
  // Get all todos
  getTodos: async (params?: {
    completed?: boolean;
    priority?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<Todo[]> => {
    const response = await api.get('/todos', { params });
    return response.data;
  },

  // Get single todo
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create todo
  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    const response = await api.post('/todos', data);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: string, data: UpdateTodoData): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data;
  },

  // Toggle todo completion
  toggleTodo: async (id: string): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

export default api;
