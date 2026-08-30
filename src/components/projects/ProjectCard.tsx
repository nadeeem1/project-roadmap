import { useState } from 'react';
import { MoreVertical, Calendar, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { TagBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { formatDate } from '../../utils/formatDate';
import { getProjectProgress } from '../../utils/taskUtils';
import { cn } from '../../utils/cn';

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  on_hold: { label: 'On Hold', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  completed: { label: 'Completed', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  archived: { label: 'Archived', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' },
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const { tasks, deleteProject, addToast, setActiveProject } = useAppStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const progress = getProjectProgress(projectTasks);
  const statusConfig = statusLabels[project.status];

  function handleView() {
    setActiveProject(project.id);
    navigate(`/projects/${project.id}`);
  }

  function handleDelete() {
    deleteProject(project.id);
    addToast({
      type: 'success',
      title: 'Project deleted',
      message: `"${project.name}" and its tasks were removed.`,
    });
  }

  return (
    <>
      <div className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 shrink-0 rounded-xl"
              style={{ backgroundColor: project.color + '20' }}
            >
              <div
                className="flex h-full w-full items-center justify-center rounded-xl text-lg font-bold"
                style={{ color: project.color }}
              >
                {project.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <button
                onClick={handleView}
                className="text-left text-sm font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
              >
                {project.name}
              </button>
              <span className={cn('mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium', statusConfig.className)}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Project actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-slate-100 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <button
                    onClick={() => { setMenuOpen(false); handleView(); }}
                    className="flex w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    View project
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(project); }}
                    className="flex w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Edit project
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

        {/* Description */}
        {project.description && (
          <p className="mb-4 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{progress}%</span>
          </div>
          <ProgressBar value={progress} color={project.color} />
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>{projectTasks.length} tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{project.dueDate ? formatDate(project.dueDate) : 'No deadline'}</span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Deleting "${project.name}" will also remove all ${projectTasks.length} tasks. This cannot be undone.`}
        confirmLabel="Delete Project"
        isDestructive
      />
    </>
  );
}
