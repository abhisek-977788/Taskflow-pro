import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openTaskModal } from '../store/slices/uiSlice';
import useTasks from '../hooks/useTasks';
import StatCard from '../components/dashboard/StatCard';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import { PriorityBadge } from '../components/ui/Badge';
import { formatDueDate, getGreeting } from '../utils/helpers';
import { SkeletonCard } from '../components/ui/Loader';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { stats, statsLoading, loadStats } = useTasks();

  useEffect(() => { loadStats(); }, []);

  const getStatCount = (statusArr, key) => {
    const found = (statusArr || []).find((s) => s._id === key);
    return found?.count || 0;
  };

  const total = (stats?.byStatus || []).reduce((sum, s) => sum + s.count, 0);
  const completed = getStatCount(stats?.byStatus, 'completed');
  const inProgress = getStatCount(stats?.byStatus, 'inprogress');
  const overdue = stats?.overdueCount || 0;

  const statCards = [
    { title: 'Total Tasks', value: total, icon: TrendingUp, color: '#6c63ff', delay: 0 },
    { title: 'Completed', value: completed, icon: CheckSquare, color: '#34d399', delay: 0.1 },
    { title: 'In Progress', value: inProgress, icon: Clock, color: '#a78bfa', delay: 0.2 },
    { title: 'Overdue', value: overdue, icon: AlertTriangle, color: '#f87171', delay: 0.3 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-white/40 text-sm mt-1">Here's what's happening with your tasks today.</p>
        </div>
        <button onClick={() => dispatch(openTaskModal())} className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl">
          <Plus size={16} /> New Task
        </button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((c) => <StatCard key={c.title} {...c} />)}
      </div>

      {/* Chart + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart data={stats?.weekly || []} />
        </div>

        {/* Today's tasks */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Today's Tasks</h3>
            <Link to="/tasks" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {statsLoading ? (
            <div className="space-y-2">{Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : stats?.todayTasks?.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-72">
              {stats.todayTasks.map((task) => (
                <motion.div key={task._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-white/[0.04]"
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="mt-0.5">
                    <CheckSquare size={14} className={task.status === 'completed' ? 'text-emerald-400' : 'text-white/20'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${task.status === 'completed' ? 'line-through text-white/30' : 'text-white/80'}`}>
                      {task.title}
                    </p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/20">
              <CheckSquare size={32} className="mb-2" />
              <p className="text-sm">No tasks due today</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Priority breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Priority Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'urgent', label: 'Urgent', color: '#f87171' },
            { key: 'high',   label: 'High',   color: '#fbbf24' },
            { key: 'medium', label: 'Medium', color: '#60a5fa' },
            { key: 'low',    label: 'Low',    color: '#34d399' },
          ].map(({ key, label, color }) => {
            const count = getStatCount(stats?.byPriority, key);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key} className="p-3 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                <div className="text-lg font-bold mb-0.5" style={{ color }}>{count}</div>
                <div className="text-xs text-white/50 mb-2">{label}</div>
                <div className="h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
