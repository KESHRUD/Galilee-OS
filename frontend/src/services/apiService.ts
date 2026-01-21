import { db } from './storage';
import type { Task, Column as ColumnType } from '../types';

/**
 * ============================================================================
 * API SERVICE - Dual Mode (PWA / DDAW)
 * ============================================================================
 * 
 * Service unifié qui switche automatiquement entre :
 * - Mode PWA : IndexedDB (storage.ts)
 * - Mode DDAW : Backend API (fetch vers Render.com)
 */

// Configuration API
const API_URL = import.meta.env.VITE_API_URL || 'https://galilee-os-backend.onrender.com';

// Token JWT (stocké en localStorage)
let authToken: string | null = localStorage.getItem('jwt_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('jwt_token', token);
  } else {
    localStorage.removeItem('jwt_token');
  }
};

export const getAuthToken = () => authToken;

// Headers pour les requêtes API
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

/**
 * ============================================================================
 * TASKS API
 * ============================================================================
 */

export const tasksAPI = {
  /**
   * GET all tasks
   */
  async getAll(mode: 'pwa' | 'ddaw'): Promise<Task[]> {
    if (mode === 'pwa') {
      // Mode PWA : IndexedDB
      return await db.getAllTasks();
    } else {
      // Mode DDAW : Backend API
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || [];
    }
  },

  /**
   * GET task by ID
   */
  async getById(id: string, mode: 'pwa' | 'ddaw'): Promise<Task | null> {
    if (mode === 'pwa') {
      const allTasks = await db.getAllTasks();
      return allTasks.find(task => task.id === id) || null;
    } else {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch task: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    }
  },

  /**
   * CREATE task
   */
  async create(task: Omit<Task, 'id' | 'createdAt'>, mode: 'pwa' | 'ddaw'): Promise<Task> {
    if (mode === 'pwa') {
      const created: Task = {
        ...task,
        id: `t-${Date.now()}`,
        createdAt: Date.now(),
      } as Task;
      await db.saveTask(created);
      return created;
    } else {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    }
  },

  /**
   * UPDATE task
   */
  async update(id: string, updates: Partial<Task>, mode: 'pwa' | 'ddaw'): Promise<Task> {
    if (mode === 'pwa') {
      const allTasks = await db.getAllTasks();
      const existing = allTasks.find(task => task.id === id);
      if (!existing) throw new Error('Task not found after update');
      const updated = { ...existing, ...updates } as Task;
      await db.saveTask(updated);
      return updated;
    } else {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    }
  },

  /**
   * DELETE task
   */
  async delete(id: string, mode: 'pwa' | 'ddaw'): Promise<void> {
    if (mode === 'pwa') {
      await db.deleteTask(id);
    } else {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }
    }
  },
};

/**
 * ============================================================================
 * COLUMNS API
 * ============================================================================
 */

export const columnsAPI = {
  /**
   * GET all columns
   */
  async getAll(mode: 'pwa' | 'ddaw'): Promise<ColumnType[]> {
    if (mode === 'pwa') {
      return await db.getAllColumns();
    } else {
      const response = await fetch(`${API_URL}/api/columns`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch columns: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || [];
    }
  },

  /**
   * CREATE column
   */
  async create(column: Omit<ColumnType, 'id'>, mode: 'pwa' | 'ddaw'): Promise<ColumnType> {
    if (mode === 'pwa') {
      const created: ColumnType = {
        ...column,
        id: `col-${Date.now()}`,
      } as ColumnType;
      await db.saveColumn(created);
      return created;
    } else {
      const response = await fetch(`${API_URL}/api/columns`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(column),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create column: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    }
  },

  /**
   * UPDATE column
   */
  async update(id: string, updates: Partial<ColumnType>, mode: 'pwa' | 'ddaw'): Promise<ColumnType> {
    if (mode === 'pwa') {
      const allColumns = await db.getAllColumns();
      const existing = allColumns.find(column => column.id === id);
      if (!existing) throw new Error('Column not found after update');
      const updated = { ...existing, ...updates } as ColumnType;
      await db.saveColumn(updated);
      return updated;
    } else {
      const response = await fetch(`${API_URL}/api/columns/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update column: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    }
  },

  /**
   * DELETE column
   */
  async delete(id: string, mode: 'pwa' | 'ddaw'): Promise<void> {
    if (mode === 'pwa') {
      await db.deleteColumn(id);
    } else {
      const response = await fetch(`${API_URL}/api/columns/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete column: ${response.statusText}`);
      }
    }
  },
};

/**
 * ============================================================================
 * AUTH API (DDAW uniquement)
 * ============================================================================
 */

export const authAPI = {
  /**
   * Login
   */
  async login(email: string, password: string): Promise<{ token: string; user: unknown }> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed: Invalid credentials');
    }
    
    const data = await response.json();
    setAuthToken(data.token);
    return data;
  },

  /**
   * Register
   */
  async register(email: string, password: string): Promise<{ token: string; user: unknown }> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Registration failed');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  },

  /**
   * Logout
   */
  logout() {
    setAuthToken(null);
  },
};

/**
 * ============================================================================
 * SYNC API - Synchroniser PWA ↔ DDAW
 * ============================================================================
 */

export const syncAPI = {
  /**
   * Sync local data to backend
   */
  async syncToBackend(): Promise<void> {
    const localTasks = await db.getAllTasks();
    const localColumns = await db.getAllColumns();
    
    // Upload columns first
    for (const column of localColumns) {
      try {
        await columnsAPI.create(column, 'ddaw');
      } catch (err) {
        console.error('Failed to sync column:', column.id, err);
      }
    }
    
    // Upload tasks
    for (const task of localTasks) {
      try {
        await tasksAPI.create(task, 'ddaw');
      } catch (err) {
        console.error('Failed to sync task:', task.id, err);
      }
    }
  },

  /**
   * Sync backend data to local
   */
  async syncFromBackend(): Promise<void> {
    const remoteTasks = await tasksAPI.getAll('ddaw');
    const remoteColumns = await columnsAPI.getAll('ddaw');
    
    // Clear local data (tasks + columns)
    const localTasks = await db.getAllTasks();
    const localColumns = await db.getAllColumns();
    for (const task of localTasks) {
      await db.deleteTask(task.id);
    }
    for (const column of localColumns) {
      await db.deleteColumn(column.id);
    }
    
    // Download columns
    for (const column of remoteColumns) {
      await db.saveColumn(column);
    }
    
    // Download tasks
    for (const task of remoteTasks) {
      await db.saveTask(task);
    }
  },
};
