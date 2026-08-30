import { useState } from 'react';
import { CheckSquare, Clock, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppStore } from '../store/useAppStore';
import { getProjectProgress, isOverdue } from '../utils/taskUtils';
import { parseISO, isWithinInterval, addDays } from 'date-fns';
import type { Task } from '../types';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export function Dashboard() {
  const { tasks, projects } = useAppStore();
  const navigate = useNavigate();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length;

  // Tasks due in the next 7 days
  const upcomingTasks = tasks
    .filter((t) => {
      if (!t.dueDate || t.status === 'done') return false;
      const due = parseISO(t.dueDate);
      return isWithinInterval(due, { start: new Date(), end: addDays(new Date(), 7) });
    })
    .slice(0, 4);

  // Recent tasks (last 5 created)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  function getProject(id: string) {
    return projects.find((p) => p.id === id);
  }

  return (
    <>
      <Header title="Dashboard" onNewTask={() => setTaskFormOpen(true)} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Tasks" value={totalTasks} icon={CheckSquare} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" />
          <StatCard label="Completed" value={doneTasks} icon={TrendingUp} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
          <StatCard label="In Progress" value={inProgressTasks} icon={Clock} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          <StatCard label="Overdue" value={overdueTasks} icon={AlertCircle} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" />
        </div>

        {/* Projects Overview */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Active Projects</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              View all
            </Button>
          </div>

          {projects.filter((p) => p.status === 'active').length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500">No active projects yet.</p>
              <Button className="mt-3" size="sm" onClick={() => navigate('/projects')}>
                <Plus className="h-4 w-4" /> Create Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.filter((p) => p.status === 'active').map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const progress = getProjectProgress(projectTasks);
                const done = projectTasks.filter((t) => t.status === 'done').length;

                return (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-left transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-3 flex items-center gap-2.5">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: project.color }}
                      >
                        {project.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{project.name}</span>
                    </div>
                    <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{done}/{projectTasks.length} tasks done</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Due Soon */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Due This Week
              </h2>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                {upcomingTasks.length} tasks
              </span>
            </div>
            {upcomingTasks.length === 0 ? (
              <EmptyState
                icon={<Clock className="h-7 w-7" />}
                title="Nothing due soon"
                description="You're all caught up for the week."
              />
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
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
          </section>

          {/* Recent Tasks */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recently Added</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
                View all
              </Button>
            </div>
            {recentTasks.length === 0 ? (
              <EmptyState
                icon={<CheckSquare className="h-7 w-7" />}
                title="No tasks yet"
                description="Create your first task to get started."
                action={
                  <Button size="sm" onClick={() => setTaskFormOpen(true)}>
                    <Plus className="h-4 w-4" /> New Task
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
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
          </section>
        </div>
      </div>

      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
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
    </>
  );
}
