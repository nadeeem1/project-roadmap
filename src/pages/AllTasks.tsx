import { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskFiltersBar } from '../components/tasks/TaskFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { filterAndSortTasks } from '../utils/taskUtils';
import type { Task } from '../types';

export function AllTasks() {
  const { tasks, projects, filters } = useAppStore();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const filteredTasks = filterAndSortTasks(tasks, filters);

  function getProject(id: string) {
    return projects.find((p) => p.id === id);
  }

  return (
    <>
      <Header title="All Tasks" onNewTask={() => setTaskFormOpen(true)} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Filters */}
        <TaskFiltersBar />

        {/* Count + New Task */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            {tasks.length !== filteredTasks.length && ` (filtered from ${tasks.length})`}
          </p>
          <Button size="sm" onClick={() => setTaskFormOpen(true)} className="sm:hidden">
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>

        {/* Task Grid */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="h-8 w-8" />}
            title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            description={
              tasks.length === 0
                ? 'Get started by creating your first task.'
                : 'Try adjusting your filters to find what you\'re looking for.'
            }
            action={
              tasks.length === 0 ? (
                <Button onClick={() => setTaskFormOpen(true)}>
                  <Plus className="h-4 w-4" /> Create Task
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                project={getProject(task.projectId)}
                onEdit={(t) => setEditTask(t)}
                onView={(t) => setSelectedTask(t)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskForm isOpen={taskFormOpen} onClose={() => setTaskFormOpen(false)} />

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
    </>
  );
}
