// Matches frontend types

export type Priority = "low" | "medium" | "high";

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
  dueDate?: number;
  subtasks: Subtask[];
  comments: Comment[];
  diagramCode?: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  columnId?: string;
  tags?: string[];
  priority?: Priority;
  dueDate?: number;
  subtasks?: Subtask[];
  diagramCode?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  columnId?: string;
  tags?: string[];
  priority?: Priority;
  dueDate?: number;
  subtasks?: Subtask[];
  comments?: Comment[];
  diagramCode?: string;
}

export interface CreateColumnDTO {
  title: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  createdAt: string;
}
