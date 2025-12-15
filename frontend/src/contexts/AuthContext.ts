/**
 * Auth Context - separated from AuthProvider for Fast Refresh compatibility
 */

import { createContext } from 'react';
import type { AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
