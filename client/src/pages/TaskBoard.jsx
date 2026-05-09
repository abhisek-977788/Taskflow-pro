import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { openTaskModal, setViewMode } from '../store/slices/uiSlice';
import { socketTaskCreated, socketTaskUpdated, socketTaskDeleted } from '../store/slices/taskSlice';
import useTasks from '../hooks/useTasks';
import useDebounce from '../hooks/useDebounce';
import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskCard from '../components/tasks/TaskCard';
import { PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { KANBAN_COLUMNS, PRIORITY_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from '../utils/constants';
import { SkeletonCard } from '../components/ui/Loader';

export default function TaskBoard() {
  const dispatch = useDispatch();
  const { items: tasks, filters, loading, loadTasks, update, reorder, updateFilter, resetFilters } = useTasks();
  const { viewMode } = useSelector((s) => s.ui);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { loadTasks(); }, []);
  useEffect(() => { updateFilter({ search: debouncedSearch }); }, [debouncedSearch]);
  useEffect(() => { loadTasks(); }, [filters]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getColumnTasks = (colId) => tasks.filter((t) => t.status === colId).sort((a, b) => a.position - b.position);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t._id === active.id));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const overTask = tasks.find((t) => t._id === over.id);
    const overColumn = KANBAN_COLUMNS.find((c) => c.id === over.id);

    if (!activeTask) return;

    // Dropped on a column
    if (overColumn && activeTask.status !== overColumn.id) {
      await update(activeTask._id, { status: overColumn.id });
      return;
    }

    // Dropped on another task — reorder within same column or move to new column
    if (overTask) {
      const newStatus = overTask.status;
      const colTasks = tasks.filter((t) => t.status === newStatus).sort((a, b) => a.position - b.position);
      const oldIndex = colTasks.findIndex((t) => t._id === active.id);
      const newIndex = colTasks.findIndex((t) => t._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(colTasks, oldIndex, newIndex);
        const reorderPayload = reordered.map((t, i) => ({ id: t._id, status: newStatus, position: i }));
        await reorder(reorderPayload);
      } else if (activeTask.status !== newStatus) {
        await update(activeTask._id, { status: newStatus });
      }
    }
  };

  const hasFilters = filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="page-title">Task Board</h1>
          <p className="text-white/40 text-sm mt-1">{tasks.length} tasks · Drag to reorder</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[{ mode: 'kanban', icon: LayoutGrid }, { mode: 'list', icon: List }].map(({ mode, icon: Icon }) => (
              <button key={mode} onClick={() => dispatch(setViewMode(mode))}
                className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                style={viewMode === mode ? { background: 'rgba(108,99,255,0.3)' } : {}}>
                <Icon size={16} />
              </button>
            ))}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition-all ${showFilters ? 'text-primary-400' : 'text-white/40 hover:text-white/70'}`}
            style={{ background: showFilters ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <SlidersHorizontal size={16} />
          </button>
          <button onClick={() => dispatch(openTaskModal())} className="btn-primary px-4 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-5 space-y-3">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..." className="input-field pl-9 py-2.5 text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-3 overflow-hidden">
              {[
                { label: 'Status', key: 'status', opts: STATUS_OPTIONS },
                { label: 'Priority', key: 'priority', opts: PRIORITY_OPTIONS },
              ].map(({ label, key, opts }) => (
                <select key={key} value={filters[key] || ''} onChange={(e) => updateFilter({ [key]: e.target.value })}
                  className="input-field py-2 text-sm w-auto min-w-[140px]">
                  <option value="">All {label}</option>
                  {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ))}
              <select value={filters.sort || '-createdAt'} onChange={(e) => updateFilter({ sort: e.target.value })}
                className="input-field py-2 text-sm w-auto min-w-[160px]">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {hasFilters && (
                <button onClick={resetFilters} className="px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-xl transition-colors border border-red-400/20">
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {KANBAN_COLUMNS.map((col) => (
              <KanbanColumn key={col.id} column={col} tasks={getColumnTasks(col.id)} />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? <div className="rotate-2 opacity-90 scale-105"><TaskCard task={activeTask} /></div> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {loading ? (
            Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/20">
              <Plus size={40} className="mb-3" />
              <p className="text-lg font-semibold">No tasks found</p>
              <p className="text-sm mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div key={task._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
