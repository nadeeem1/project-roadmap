import { Calendar, MoreVertical, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { Task, Project } from '../../types';
import { PriorityBadge, StatusBadge, TagBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { ConfirmModal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatDate';
import { getSubtaskProgress, isOverdue } from '../../utils/taskUtils';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
}

export function TaskCard({ task, project, onEdit, onView }: TaskCardProps) {
  const { deleteTask, addToast } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const subtaskProgress = getSubtaskProgress(task);
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  function handleDelete() {
    deleteTask(task.id);
    addToast({ type: 'success', title: 'Task deleted', message: `"${task.title}" was removed.` });
  }

  return (
    <>
      <div
        className={cn(
          'group relative rounded-xl border bg-white p-4 transition-shadow hover:shadow-md',
          'dark:bg-slate-900 dark:border-slate-800',
          overdue ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200'
        )}
      >
        {/* Top Row: Badges + Menu */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Task actions"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-slate-100 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <button
                    onClick={() => { setMenuOpen(false); onView(task); }}
                    className="flex w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    View details
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(task); }}
                    className="flex w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Edit task
                  </button>
                  <hr className="my-1 border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                    className="flex w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <button
          onClick={() => onView(task)}
          className="mb-1 block w-full text-left text-sm font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
        >
          {task.title}
        </button>

        {/* Description */}
        {task.description && (
          <p className="mb-3 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
        )}

        {/* Subtask progress */}
        {task.subtasks.length > 0 && (
          <div className="mb-3">
            <ProgressBar
              value={subtaskProgress}
              showLabel
              color={project?.color || '#6366f1'}
            />
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">
              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
            </p>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {task.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer: Due date + Project */}
        <div className="flex items-center justify-between">
          <div className={cn('flex items-center gap-1 text-xs', overdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500')}>
            {overdue && <AlertCircle className="h-3 w-3" />}
            {!overdue && <Calendar className="h-3 w-3" />}
            <span>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
          </div>
          {project && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.name}
            </span>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        isDestructive
      />
    </>
  );
}
