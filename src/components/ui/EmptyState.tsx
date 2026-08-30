import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action}
    </div>
  );
}
