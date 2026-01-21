import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/apiService';
import { useMode } from '../contexts/ModeContext';
import type { Task } from '../types';

/**
 * ============================================================================
 * useTasks - Hook pour gérer les tâches en dual mode
 * ============================================================================
 * 
 * Switche automatiquement entre IndexedDB (PWA) et Backend API (DDAW)
 */

export const useTasks = () => {
  const { mode } = useMode();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger toutes les tâches
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = await tasksAPI.getAll(mode);
      setTasks(allTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  /**
   * Créer une nouvelle tâche
   */
  const createTask = useCallback(
    async (task: Omit<Task, 'id' | 'createdAt'>) => {
      try {
        const created = await tasksAPI.create(task, mode);
        setTasks((prev) => [...prev, created]);
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task');
        console.error('Error creating task:', err);
        throw err;
      }
    },
    [mode]
  );

  /**
   * Mettre à jour une tâche
   */
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        const updated = await tasksAPI.update(id, updates, mode);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
        console.error('Error updating task:', err);
        throw err;
      }
    },
    [mode]
  );

  /**
   * Supprimer une tâche
   */
  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await tasksAPI.delete(id, mode);
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
        console.error('Error deleting task:', err);
        throw err;
      }
    },
    [mode]
  );

  /**
   * Charger les tâches au montage et quand le mode change
   */
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refresh: loadTasks,
  };
};
