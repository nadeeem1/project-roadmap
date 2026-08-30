import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  color?: string;
}

export function ProgressBar({ value, className, showLabel = false, size = 'sm', color }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightMap = { sm: 'h-1.5', md: 'h-2.5' };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700', heightMap[size])}>
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color || '#6366f1',
          }}
        />
      </div>
      {showLabel && (
        <span className="w-8 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
