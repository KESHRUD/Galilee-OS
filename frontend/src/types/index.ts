
export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  tags: string[];
  priority: Priority;
  createdAt: number;
  dueDate?: number; // Timestamp
  subtasks: Subtask[];
  comments: Comment[];
  diagramCode?: string; // MermaidJS code
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

// Enhanced Flashcard for SRS
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // SRS Fields
  lastReviewed?: number;
  nextReview?: number;
  interval?: number; // Days
  easeFactor?: number; // Multiplier
  streak?: number;
}

export interface Deck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
  coverUrl?: string; // New: Image for the deck
}

// Goals System
export interface DailyGoal {
  target: number; // Number of cards to review
  progress: number;
  lastUpdated: number; // Date timestamp (set to midnight of current day)
  streak: number;
}

export type ThemeMode = 'pro' | 'galilee';
export type ViewMode = 'board' | 'flashcards';
export type Language = 'fr' | 'en';

export interface DragItem {
  id: string;
  columnId: string;
}

export type Speciality = 'info' | 'energy' | 'telecom' | 'instrumentation' | 'macs' | 'prepa';

export interface User {
  username: string;
  name: string;
  role: 'student' | 'engineer' | 'admin';
  avatarUrl?: string;
  provider?: 'google' | 'local';
  speciality?: Speciality;
  email?: string;
  // Gamification
  xp: number;
  level: number;
  rank: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, provider?: 'google' | 'local', speciality?: Speciality) => Promise<void>;
  register: (data: { username: string; email: string; speciality: Speciality }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserXp: (amount: number) => Promise<void>;
}

// Audio Types
export type SoundType = 'hover' | 'click' | 'success' | 'error' | 'open' | 'flip' | 'levelup';
