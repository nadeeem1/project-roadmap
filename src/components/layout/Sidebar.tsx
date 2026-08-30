import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'All Tasks' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { setSidebarOpen } = useAppStore();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Taskify
          </span>
        </div>
        {/* Close button — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          Menu
        </p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Bottom: Settings */}
      <div className="border-t border-slate-100 px-3 py-4 dark:border-slate-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            )
          }
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
