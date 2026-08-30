import { Menu, Moon, Sun, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  onNewTask?: () => void;
  onNewProject?: () => void;
}

export function Header({ title, onNewTask, onNewProject }: HeaderProps) {
  const { theme, toggleTheme, setSidebarOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {onNewTask && (
          <Button size="sm" onClick={onNewTask} className="hidden sm:flex">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}
        {onNewProject && (
          <Button size="sm" onClick={onNewProject} className="hidden sm:flex">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
        {(onNewTask || onNewProject) && (
          <Button
            size="icon"
            onClick={onNewTask || onNewProject}
            className="sm:hidden"
            aria-label="Create new"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
