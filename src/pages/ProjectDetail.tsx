import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, CheckSquare, Calendar } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskFiltersBar } from '../components/tasks/TaskFilters';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { TagBadge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { filterAndSortTasks, getProjectProgress } from '../utils/taskUtils';
import { formatDate } from '../utils/formatDate';
import type { Task } from '../types';

const STATUS_COLUMNS = [
  { key: 'todo' as const, label: 'To Do' },
  { key: 'in_progress' as const, label: 'In Progress' },
  { key: 'in_review' as const, label: 'In Review' },
  { key: 'done' as const, label: 'Done' },
];

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, filters } = useAppStore();

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-slate-500 dark:text-slate-400">Project not found.</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === id);
  const filteredTasks = filterAndSortTasks(projectTasks, { ...filters, projectId: id! });
  const progress = getProjectProgress(projectTasks);

  return (
    <>
      <Header
        title={project.name}
        onNewTask={() => setTaskFormOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>

        {/* Project Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: project.color }}
              >
                {project.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h2>
                {project.description && (
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setProjectFormOpen(true)}>
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
              <Button size="sm" onClick={() => setTaskFormOpen(true)}>
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Tasks</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{projectTasks.length}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/10">
              <p className="text-[10px] text-green-600 uppercase tracking-wide">Completed</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {projectTasks.filter((t) => t.status === 'done').length}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
              <p className="text-[10px] text-blue-600 uppercase tracking-wide">In Progress</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {projectTasks.filter((t) => t.status === 'in_progress').length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Progress</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{progress}%</p>
            </div>
          </div>

          <ProgressBar value={progress} color={project.color} size="md" className="mb-3" />

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Due: {formatDate(project.dueDate)}
            </div>
            {project.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>

        {/* Filters */}
        <TaskFiltersBar />

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {(['list', 'board'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="h-8 w-8" />}
            title="No tasks found"
            description="Try adjusting your filters or add a new task to this project."
            action={
              <Button onClick={() => setTaskFormOpen(true)}>
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            }
          />
        ) : viewMode === 'list' ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                project={project}
                onEdit={(t) => setEditTask(t)}
                onView={(t) => setSelectedTask(t)}
              />
            ))}
          </div>
        ) : (
          // Board view — columns by status
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATUS_COLUMNS.map(({ key, label }) => {
              const columnTasks = filteredTasks.filter((t) => t.status === key);
              return (
                <div key={key} className="rounded-xl bg-slate-100/60 p-3 dark:bg-slate-800/30">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {label}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        project={project}
                        onEdit={(t) => setEditTask(t)}
                        onView={(t) => setSelectedTask(t)}
                      />
                    ))}
                    {columnTasks.length === 0 && (
                      <p className="py-4 text-center text-xs text-slate-400">Empty</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        defaultProjectId={id}
      />

      <TaskForm
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        editTask={editTask}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(t) => { setSelectedTask(null); setEditTask(t); }}
      />

      <ProjectForm
        isOpen={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        editProject={project}
      />
    </>
  );
}
