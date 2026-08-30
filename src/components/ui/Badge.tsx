import { cn } from '../../utils/cn';
import type { Priority, TaskStatus } from '../../types';

// --- Priority Badge ---
const priorityConfig: Record<Priority, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
};

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_review: { label: 'In Review', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  );
}

interface TagBadgeProps {
  tag: string;
  className?: string;
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400', className)}>
      #{tag}
    </span>
  );
}
