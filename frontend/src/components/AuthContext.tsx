import React, { useState, useEffect } from 'react';
import type { User, Speciality } from '../types';
import { authService } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, provider: 'google' | 'local' = 'local', speciality?: Speciality) => {
    const user = await authService.login(username, provider, speciality);
    setUser(user);
  };

  const register = async (data: { username: string; email: string; speciality: Speciality }) => {
      const user = await authService.register(data);
      setUser(user);
  }

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserXp = async (amount: number) => {
      if (!user) return;
      const updatedUser = await authService.updateXp(amount);
      if (updatedUser) {
          if (updatedUser.level > user.level) {
              // Level Up Sound!
              // audioManager.play('levelup'); // Future implementation
          }
          setUser(updatedUser);
      }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading: loading, login, register, logout, isAuthenticated: !!user, updateUserXp }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
