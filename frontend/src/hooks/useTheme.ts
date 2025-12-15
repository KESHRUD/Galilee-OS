/**
 * Theme hook - provides access to theme context
 * Separated from ThemeContext.tsx for Fast Refresh compatibility
 */

import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

export const useTheme = () => useContext(ThemeContext);
