import { cn } from '../../utils/cn';
import { forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
  outline:
    'border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
  icon: 'h-9 w-9',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
