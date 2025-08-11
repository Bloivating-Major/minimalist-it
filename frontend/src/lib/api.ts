import axios from 'axios';
import type { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';
import { config } from '../config/env';

// Use centralized configuration
const API_BASE_URL = config.apiBaseUrl;

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

  // Reorder todos
  reorderTodos: async (todoIds: string[]): Promise<Todo[]> => {
    const response = await api.patch('/todos/reorder', { todoIds });
    return response.data;
  },
};

export default api;
