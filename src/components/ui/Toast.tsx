import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import type { Toast as ToastType } from '../../types';

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
    iconClass: 'text-green-600 dark:text-green-400',
    titleClass: 'text-green-900 dark:text-green-100',
    msgClass: 'text-green-700 dark:text-green-300',
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-900 dark:text-red-100',
    msgClass: 'text-red-700 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800',
    iconClass: 'text-yellow-600 dark:text-yellow-400',
    titleClass: 'text-yellow-900 dark:text-yellow-100',
    msgClass: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-900 dark:text-blue-100',
    msgClass: 'text-blue-700 dark:text-blue-300',
  },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useAppStore((s) => s.removeToast);
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg',
        'animate-in slide-in-from-right-5 fade-in duration-300',
        config.className
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.iconClass)} />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', config.titleClass)}>{toast.title}</p>
        {toast.message && (
          <p className={cn('mt-0.5 text-xs', config.msgClass)}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className={cn('shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100', config.iconClass)}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
