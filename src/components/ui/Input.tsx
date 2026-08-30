import { cn } from '../../utils/cn';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
              error
                ? 'border-red-400 focus:ring-red-500 dark:border-red-500'
                : 'border-slate-200 dark:border-slate-700',
              leftIcon && 'pl-9',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
            'min-h-[80px] resize-y',
            error
              ? 'border-red-400 focus:ring-red-500 dark:border-red-500'
              : 'border-slate-200 dark:border-slate-700',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'dark:bg-slate-800 dark:text-slate-100',
            error
              ? 'border-red-400 focus:ring-red-500 dark:border-red-500'
              : 'border-slate-200 dark:border-slate-700',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
