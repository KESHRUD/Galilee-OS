import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ============================================================================
 * MODE CONTEXT - Toggle entre PWA (offline) et DDAW (backend API)
 * ============================================================================
 * 
 * PWA Mode:
 * - Stockage local (IndexedDB)
 * - Offline-first
 * - Service Workers
 * - Pas de backend
 * 
 * DDAW Mode:
 * - Backend API (Render.com)
 * - PostgreSQL
 * - Synchronisation cloud
 * - JWT Authentication
 */

export type AppMode = 'pwa' | 'ddaw';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isOffline: boolean;
  apiUrl: string;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer le mode depuis localStorage (par défaut: PWA)
  const [mode, setModeState] = useState<AppMode>(() => {
    const saved = localStorage.getItem('app-mode');
    return (saved === 'ddaw' ? 'ddaw' : 'pwa') as AppMode;
  });

  // Détecter si on est offline (pour mode PWA)
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // URL de l'API backend (depuis env ou hardcodé)
  const apiUrl = import.meta.env.VITE_API_URL || 'https://galilee-os-backend.onrender.com';

  // Sauvegarder le mode dans localStorage
  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem('app-mode', newMode);
    
    // Log pour debug
    console.log(`🔄 Mode switched to: ${newMode.toUpperCase()}`);
    console.log(`📡 API URL: ${newMode === 'ddaw' ? apiUrl : 'IndexedDB (local)'}`);
  };

  // Toggle entre PWA et DDAW
  const toggleMode = () => {
    setMode(mode === 'pwa' ? 'ddaw' : 'pwa');
  };

  // Écouter les changements de connexion (online/offline)
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Avertir si mode DDAW mais offline
  useEffect(() => {
    if (mode === 'ddaw' && isOffline) {
      console.warn('⚠️ Mode DDAW activé mais connexion offline. Basculez vers mode PWA.');
    }
  }, [mode, isOffline]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, isOffline, apiUrl }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
