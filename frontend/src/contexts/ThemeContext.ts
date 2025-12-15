/**
 * Theme context type definition and context instance
 * Separated from ThemeProvider component for Fast Refresh compatibility
 */

import { createContext } from 'react';
import type { ThemeMode, Language } from '../types';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'galilee', 
  toggleTheme: () => {}, 
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key 
});
