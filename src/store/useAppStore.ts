import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Task, Toast, Theme, TaskFilters } from '../types';
import { seedProjects, seedTasks } from '../data/seed';
import { generateId } from '../utils/generateId';

interface AppState {
  // Data
  projects: Project[];
  tasks: Task[];

  // UI State
  theme: Theme;
  toasts: Toast[];
  activeProjectId: string | null;
  filters: TaskFilters;
  sidebarOpen: boolean;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Filter actions
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  resetFilters: () => void;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Theme
  toggleTheme: () => void;

  // Sidebar
  setSidebarOpen: (open: boolean) => void;
}

const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      tasks: seedTasks,
      theme: 'light',
      toasts: [],
      activeProjectId: null,
      filters: defaultFilters,
      sidebarOpen: false,

      // --- Project Actions ---
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: generateId('proj'),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [newProject, ...state.projects] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        }));
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      // --- Task Actions ---
      addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: generateId('task'),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : t
          ),
        }));
      },

      // --- Filter Actions ---
      setFilter: (key, value) => {
        set((state) => ({ filters: { ...state.filters, [key]: value } }));
      },

      resetFilters: () => set({ filters: defaultFilters }),

      // --- Toast Actions ---
      addToast: (toastData) => {
        const toast: Toast = { ...toastData, id: generateId('toast') };
        set((state) => ({ toasts: [...state.toasts, toast] }));

        // Auto-dismiss after 4s
        setTimeout(() => {
          get().removeToast(toast.id);
        }, 4000);
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },

      // --- Theme ---
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },

      // --- Sidebar ---
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'taskify-storage',
      // Only persist data, not transient UI state like toasts
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        theme: state.theme,
        activeProjectId: state.activeProjectId,
      }),
    }
  )
);
