export const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const STATUS_OPTIONS = [
  { value: 'todo',       label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'completed',  label: 'Completed' },
];

export const CATEGORY_OPTIONS = [
  'General', 'Development', 'Design', 'Marketing', 'Research', 'Bug Fix', 'Feature', 'Documentation', 'Meeting', 'Review',
];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt',  label: 'Oldest First' },
  { value: 'dueDate',    label: 'Due Date (Asc)' },
  { value: '-dueDate',   label: 'Due Date (Desc)' },
  { value: '-priority',  label: 'Priority (High → Low)' },
  { value: 'title',      label: 'Title A-Z' },
];

export const KANBAN_COLUMNS = [
  { id: 'todo',       title: 'To Do',       color: 'from-slate-500/20 to-slate-600/5',   accent: '#94a3b8' },
  { id: 'inprogress', title: 'In Progress', color: 'from-violet-500/20 to-violet-600/5', accent: '#a78bfa' },
  { id: 'completed',  title: 'Completed',   color: 'from-emerald-500/20 to-emerald-600/5', accent: '#34d399' },
];

export const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { to: '/tasks',     label: 'Task Board', icon: 'Kanban' },
  { to: '/profile',   label: 'Profile',    icon: 'User' },
  { to: '/settings',  label: 'Settings',   icon: 'Settings' },
];
