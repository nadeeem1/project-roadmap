export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  createdAt: string;
  dueDate: string | null;
  tags: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export type Theme = 'light' | 'dark';

export type SortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'all';
  priority: Priority | 'all';
  projectId: string | 'all';
  sortField: SortField;
  sortDirection: SortDirection;
}
