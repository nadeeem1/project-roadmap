import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { useAppStore } from '../../store/useAppStore';
export function AppLayout() {
  const { theme, sidebarOpen, setSidebarOpen } = useAppStore();

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <Sidebar className="relative z-50 flex w-64 flex-col shadow-xl" />
        </div>
      )}

      {/* Main content area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
