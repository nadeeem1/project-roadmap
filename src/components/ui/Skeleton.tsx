import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', className)}
    />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-4 h-3 w-full" />
      <Skeleton className="mb-4 h-1.5 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
