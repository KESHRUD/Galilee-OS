

import type { User, Speciality } from '../types';
import { authAPI } from './apiService';

const STORAGE_KEY = 'sup_galilee_auth_user';

type ApiUser = {
  id: string;
  email: string;
  role: 'admin' | 'student';
  profile?: { xp?: number; level?: number } | null;
};

const mapUser = (apiUser: ApiUser, speciality: Speciality = 'prepa'): User => {
  const nameSeed = apiUser.email.split('@')[0] || 'user';
  const displayName = nameSeed.charAt(0).toUpperCase() + nameSeed.slice(1);
  const avatarSeed = `${speciality}_${nameSeed}`;
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=transparent`;
  const xp = apiUser.profile?.xp ?? 0;
  const level = apiUser.profile?.level ?? 1;

  let rank = 'Novice';
  if (level >= 2) rank = 'Adept';
  if (level >= 5) rank = 'Engineer';
  if (level >= 10) rank = 'Senior';
  if (level >= 20) rank = 'Legend';

  return {
    username: apiUser.email,
    name: displayName,
    role: apiUser.role === 'admin' ? 'admin' : 'student',
    provider: 'local',
    speciality,
    email: apiUser.email,
    avatarUrl,
    xp,
    level,
    rank,
  };
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const data = await authAPI.login(email, password);
    const user = mapUser(data.user as ApiUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  register: async (data: { email: string; password: string; speciality: Speciality }): Promise<User> => {
    const result = await authAPI.register(data.email, data.password);
    const user = mapUser(result.user as ApiUser, data.speciality);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    authAPI.logout();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  updateXp: async (amount: number): Promise<User | null> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const user = JSON.parse(stored) as User;
    const newXp = (user.xp || 0) + amount;
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

    let newRank = 'Novice';
    if (newLevel >= 2) newRank = 'Adept';
    if (newLevel >= 5) newRank = 'Engineer';
    if (newLevel >= 10) newRank = 'Senior';
    if (newLevel >= 20) newRank = 'Legend';

    const updatedUser = { ...user, xp: newXp, level: newLevel, rank: newRank };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
};
