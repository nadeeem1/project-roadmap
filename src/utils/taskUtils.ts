import { compareAsc, compareDesc, parseISO } from 'date-fns';
import type { Task, TaskFilters, Priority } from '../types';

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function filterAndSortTasks(tasks: Task[], filters: TaskFilters): Task[] {
  let result = [...tasks];

  // Filter by project
  if (filters.projectId !== 'all') {
    result = result.filter((t) => t.projectId === filters.projectId);
  }

  // Filter by status
  if (filters.status !== 'all') {
    result = result.filter((t) => t.status === filters.status);
  }

  // Filter by priority
  if (filters.priority !== 'all') {
    result = result.filter((t) => t.priority === filters.priority);
  }

  // Filter by search query
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Sort
  result.sort((a, b) => {
    const dir = filters.sortDirection === 'asc' ? 1 : -1;

    switch (filters.sortField) {
      case 'title':
        return a.title.localeCompare(b.title) * dir;

      case 'priority':
        return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;

      case 'dueDate': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const cmp = compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
        return cmp * dir;
      }

      case 'status':
        return a.status.localeCompare(b.status) * dir;

      case 'createdAt':
      default: {
        const cmp = compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
        return cmp * (filters.sortDirection === 'asc' ? -1 : 1);
      }
    }
  });

  return result;
}

export function getProjectProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function getSubtaskProgress(task: Task): number {
  if (task.subtasks.length === 0) return 0;
  const done = task.subtasks.filter((s) => s.completed).length;
  return Math.round((done / task.subtasks.length) * 100);
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return parseISO(dueDate) < new Date();
}
