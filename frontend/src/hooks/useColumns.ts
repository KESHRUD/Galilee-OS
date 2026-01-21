import { useState, useEffect, useCallback } from 'react';
import { columnsAPI } from '../services/apiService';
import { useMode } from '../contexts/ModeContext';
import type { Column } from '../types';

/**
 * ============================================================================
 * useColumns - Hook pour gérer les colonnes en dual mode
 * ============================================================================
 * 
 * Switche automatiquement entre IndexedDB (PWA) et Backend API (DDAW)
 */

export const useColumns = () => {
  const { mode } = useMode();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger toutes les colonnes
   */
  const loadColumns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allColumns = await columnsAPI.getAll(mode);
      setColumns(allColumns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load columns');
      console.error('Error loading columns:', err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  /**
   * Créer une nouvelle colonne
   */
  const createColumn = useCallback(
    async (column: Omit<Column, 'id'>) => {
      try {
        const created = await columnsAPI.create(column, mode);
        setColumns((prev) => [...prev, created]);
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create column');
        console.error('Error creating column:', err);
        throw err;
      }
    },
    [mode]
  );

  /**
   * Mettre à jour une colonne
   */
  const updateColumn = useCallback(
    async (id: string, updates: Partial<Column>) => {
      try {
        const updated = await columnsAPI.update(id, updates, mode);
        setColumns((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update column');
        console.error('Error updating column:', err);
        throw err;
      }
    },
    [mode]
  );

  /**
   * Supprimer une colonne
   */
  const deleteColumn = useCallback(
    async (id: string) => {
      try {
        await columnsAPI.delete(id, mode);
        setColumns((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete column');
        console.error('Error deleting column:', err);
        throw err;
      }
    },
    [mode]
  );

  /**
   * Charger les colonnes au montage et quand le mode change
   */
  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  return {
    columns,
    loading,
    error,
    createColumn,
    updateColumn,
    deleteColumn,
    refresh: loadColumns,
  };
};
