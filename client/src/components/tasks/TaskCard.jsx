import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { openTaskModal } from '../../store/slices/uiSlice';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { formatDueDate } from '../../utils/helpers';
import useTasks from '../../hooks/useTasks';

export default function TaskCard({ task, dragHandleProps = {} }) {
  const dispatch = useDispatch();
  const { update, remove } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const dueInfo = formatDueDate(task.dueDate);

  const handleComplete = (e) => {
    e.stopPropagation();
    update(task._id, { status: task.status === 'completed' ? 'todo' : 'completed' });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    remove(task._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(openTaskModal(task));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="task-card group relative"
      onClick={handleEdit}
      {...dragHandleProps}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={handleComplete}
            className="mt-0.5 shrink-0 transition-colors"
          >
            <CheckCircle2
              size={16}
              className={task.status === 'completed' ? 'text-emerald-400' : 'text-white/20 hover:text-white/50'}
              fill={task.status === 'completed' ? 'rgba(52,211,153,0.2)' : 'none'}
            />
          </button>
          <h3 className={`text-sm font-semibold leading-snug ${task.status === 'completed' ? 'line-through text-white/40' : 'text-white/90'}`}>
            {task.title}
          </h3>
        </div>

        {/* More menu */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 top-7 z-20 rounded-xl overflow-hidden py-1 min-w-[130px]"
                style={{ background: 'rgba(14,14,30,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <button onClick={handleEdit} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors">
                  <Edit3 size={12} /> Edit Task
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-white/40 leading-relaxed mb-3 line-clamp-2 ml-6">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5 ml-6 mb-2">
        <PriorityBadge priority={task.priority} />
        {task.category && task.category !== 'General' && (
          <span className="text-xs px-2 py-0.5 rounded-full text-white/50 border border-white/10">{task.category}</span>
        )}
      </div>

      {/* Footer */}
      {dueInfo && (
        <div className={`flex items-center gap-1 text-xs ml-6 ${dueInfo.color}`}>
          <Calendar size={11} />
          <span>{dueInfo.label}</span>
        </div>
      )}
    </motion.div>
  );
}
