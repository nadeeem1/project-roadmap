import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = parseISO(dateStr);
  if (!isValid(date)) return '—';
  return format(date, 'MMM d, yyyy');
}

export function formatRelative(dateStr: string): string {
  const date = parseISO(dateStr);
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function toInputDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  if (!isValid(date)) return '';
  return format(date, 'yyyy-MM-dd');
}
