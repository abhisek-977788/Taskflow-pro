import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Calendar, Tag, AlignLeft, Flag, Folder } from 'lucide-react';
import { closeTaskModal } from '../../store/slices/uiSlice';
import useTasks from '../../hooks/useTasks';
import Button from '../ui/Button';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS } from '../../utils/constants';

export default function TaskModal() {
  const dispatch = useDispatch();
  const { editingTask } = useSelector((s) => s.ui);
  const { create, update, loading } = useTasks();
  const isEditing = !!editingTask;

  const [form, setForm] = useState({
    title: '', description: '', status: 'todo', priority: 'medium',
    dueDate: '', category: 'General', tags: '',
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'todo',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        category: editingTask.category || 'General',
        tags: Array.isArray(editingTask.tags) ? editingTask.tags.join(', ') : '',
      });
    }
  }, [editingTask]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      dueDate: form.dueDate || undefined,
    };
    if (isEditing) {
      await update(editingTask._id, payload);
    } else {
      await create(payload);
    }
  };

  const inputClass = "input-field text-sm";
  const labelClass = "flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => dispatch(closeTaskModal())} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: 'rgba(12,12,26,0.98)', border: '1px solid rgba(108,99,255,0.25)', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-white">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
            <p className="text-xs text-white/40 mt-0.5">{isEditing ? 'Modify your task details' : 'Add a new task to your board'}</p>
          </div>
          <button onClick={() => dispatch(closeTaskModal())} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Title */}
          <div>
            <label className={labelClass}><Flag size={12} /> Task Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Enter task title..." className={inputClass} required />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}><AlignLeft size={12} /> Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Add a description..." rows={3}
              className={`${inputClass} resize-none`} />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}><Flag size={12} /> Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Category & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}><Folder size={12} /> Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}><Calendar size={12} /> Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}><Tag size={12} /> Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="design, frontend, urgent..." className={inputClass} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => dispatch(closeTaskModal())} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
