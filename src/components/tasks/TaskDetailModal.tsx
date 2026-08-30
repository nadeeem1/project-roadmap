import { Calendar, Clock, Tag, CheckSquare, FolderKanban, Edit3 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PriorityBadge, StatusBadge, TagBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Select } from '../ui/Input';
import { useAppStore } from '../../store/useAppStore';
import { formatDate, formatRelative } from '../../utils/formatDate';
import { getSubtaskProgress, isOverdue } from '../../utils/taskUtils';
import { cn } from '../../utils/cn';
import type { Task, TaskStatus } from '../../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onEdit }: TaskDetailModalProps) {
  const { projects, updateTask, toggleSubtask, addToast } = useAppStore();

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const subtaskProgress = getSubtaskProgress(task);
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  function handleStatusChange(status: TaskStatus) {
    updateTask(task!.id, { status });
    addToast({ type: 'info', title: 'Status updated', message: `Task moved to "${status.replace('_', ' ')}".` });
  }

  function handleSubtaskToggle(subtaskId: string) {
    toggleSubtask(task!.id, subtaskId);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => { onClose(); onEdit(task); }}>
            <Edit3 className="h-4 w-4" />
            Edit Task
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Title & Badges */}
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            {overdue && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Overdue
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{task.description}</p>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Project</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {project?.name || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Due Date</p>
              <p className={cn('text-sm font-medium', overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300')}>
                {formatDate(task.dueDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Created</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatRelative(task.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Last Updated</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatRelative(task.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick status change */}
        <Select
          label="Update Status"
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </Select>

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subtasks
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
              </span>
            </div>
            <ProgressBar value={subtaskProgress} className="mb-3" color={project?.color} />
            <ul className="space-y-2">
              {task.subtasks.map((subtask) => (
                <li key={subtask.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleSubtaskToggle(subtask.id)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={cn('text-sm', subtask.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300')}>
                      {subtask.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
