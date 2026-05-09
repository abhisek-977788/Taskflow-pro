import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch { return '—'; }
};

export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch { return '—'; }
};

export const formatDueDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isToday(d)) return { label: 'Today', color: 'text-amber-400' };
  if (isTomorrow(d)) return { label: 'Tomorrow', color: 'text-blue-400' };
  if (isPast(d)) return { label: formatDate(date), color: 'text-red-400' };
  return { label: formatDate(date), color: 'text-slate-400' };
};

export const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/15', border: 'border-red-400/30', dot: '#f87171' },
  high:   { label: 'High',   color: 'text-amber-400', bg: 'bg-amber-400/15', border: 'border-amber-400/30', dot: '#fbbf24' },
  medium: { label: 'Medium', color: 'text-blue-400',  bg: 'bg-blue-400/15',  border: 'border-blue-400/30',  dot: '#60a5fa' },
  low:    { label: 'Low',    color: 'text-emerald-400', bg: 'bg-emerald-400/15', border: 'border-emerald-400/30', dot: '#34d399' },
};

export const STATUS_CONFIG = {
  todo:       { label: 'To Do',       color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
  inprogress: { label: 'In Progress', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
  completed:  { label: 'Completed',   color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
};

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6c63ff&color=fff&size=128&bold=true`;
