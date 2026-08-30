import { Moon, Sun, Trash2, Download } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { useState } from 'react';
import { ConfirmModal } from '../components/ui/Modal';


export function Settings() {
  const { theme, toggleTheme, addToast } = useAppStore();
  const [resetConfirm, setResetConfirm] = useState(false);

  function handleReset() {
    // Clear localStorage and reload
    localStorage.removeItem('taskify-storage');
    window.location.reload();
  }

  function handleExport() {
    const state = useAppStore.getState();
    const data = JSON.stringify({ projects: state.projects, tasks: state.tasks }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskify-export.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Exported!', message: 'Your data has been downloaded.' });
  }

  return (
    <>
      <Header title="Settings" />

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-6">

        {/* Appearance */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Customize how Taskify looks</p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {theme === 'dark' ? 'Dark mode is on' : 'Using light mode'}
                </p>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <><Moon className="h-4 w-4" /> Enable Dark Mode</>
                ) : (
                  <><Sun className="h-4 w-4" /> Enable Light Mode</>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Data Management</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Export or reset your workspace data</p>
          </div>
          <div className="space-y-4 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Export Data</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Download your projects and tasks as JSON</p>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Reset Workspace</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Delete all your data and restore the demo content
                </p>
              </div>
              <Button variant="danger" onClick={() => setResetConfirm(true)}>
                <Trash2 className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">About Taskify</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Taskify is a professional task and project management dashboard built with React, TypeScript, and Tailwind CSS.
            It demonstrates real-world frontend architecture including state management with Zustand, persistent local storage,
            dark mode, responsive design, filtering, sorting, and modular component design.
          </p>
          <p className="mt-3 text-xs text-slate-400">Version 1.0.0</p>
        </section>
      </div>

      <ConfirmModal
        isOpen={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset Workspace"
        message="This will permanently delete all your projects and tasks, and restore the original demo data. This cannot be undone."
        confirmLabel="Reset Everything"
        isDestructive
      />
    </>
  );
}
