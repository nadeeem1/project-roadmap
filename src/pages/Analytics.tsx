import { Header } from '../components/layout/Header';
import { useAppStore } from '../store/useAppStore';
import { getProjectProgress, isOverdue } from '../utils/taskUtils';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PriorityBadge } from '../components/ui/Badge';
import type { Priority, TaskStatus } from '../types';

const PRIORITY_KEYS: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUS_KEYS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: '#94a3b8' },
  { key: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { key: 'in_review', label: 'In Review', color: '#8b5cf6' },
  { key: 'done', label: 'Done', color: '#10b981' },
];

export function Analytics() {
  const { tasks, projects } = useAppStore();

  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((tasks.filter((t) => t.status === 'done').length / totalTasks) * 100);
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length;

  return (
    <>
      <Header title="Analytics" />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-8">

        {/* Overview cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Tasks', value: totalTasks, color: 'text-indigo-600' },
            { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-green-600' },
            { label: 'Total Projects', value: projects.length, color: 'text-blue-600' },
            { label: 'Overdue', value: overdueCount, color: 'text-red-600' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tasks by Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-5 text-sm font-semibold text-slate-900 dark:text-slate-100">Tasks by Status</h3>
            <div className="space-y-4">
              {STATUS_KEYS.map(({ key, label, color }) => {
                const count = tasks.filter((t) => t.status === key).length;
                const pct = totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100);
                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{label}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{count} <span className="text-xs text-slate-400">({pct}%)</span></span>
                    </div>
                    <ProgressBar value={pct} color={color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks by Priority */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-5 text-sm font-semibold text-slate-900 dark:text-slate-100">Tasks by Priority</h3>
            <div className="space-y-4">
              {PRIORITY_KEYS.map((priority) => {
                const count = tasks.filter((t) => t.priority === priority).length;
                const pct = totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100);
                const colors: Record<Priority, string> = {
                  critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#94a3b8',
                };
                return (
                  <div key={priority}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <PriorityBadge priority={priority} />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{count} <span className="text-xs text-slate-400">({pct}%)</span></span>
                    </div>
                    <ProgressBar value={pct} color={colors[priority]} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Progress Table */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project Progress</h3>
          </div>
          {projects.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No projects created yet.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const done = projectTasks.filter((t) => t.status === 'done').length;
                const progress = getProjectProgress(projectTasks);
                const overdue = projectTasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length;

                return (
                  <div key={project.id} className="px-6 py-4">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: project.color }}
                        >
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{project.name}</p>
                          <p className="text-xs text-slate-400">{done}/{projectTasks.length} tasks done{overdue > 0 && ` · ${overdue} overdue`}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} color={project.color} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
