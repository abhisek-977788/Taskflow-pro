import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openTaskModal } from '../../store/slices/uiSlice';
import TaskCard from './TaskCard';

function SortableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard task={task} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

export default function KanbanColumn({ column, tasks = [] }) {
  const dispatch = useDispatch();
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="kanban-column" style={{ borderColor: isOver ? `${column.accent}40` : undefined, background: isOver ? `${column.accent}08` : undefined }}>
      {/* Column header */}
      <div className="flex items-center justify-between mb-2 sticky top-0 z-10 pb-2"
        style={{ background: 'transparent' }}>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: column.accent }} />
          <h3 className="text-sm font-semibold text-white/80">{column.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full text-white/40"
            style={{ background: 'rgba(255,255,255,0.06)' }}>{tasks.length}</span>
        </div>
        <button
          onClick={() => dispatch(openTaskModal({ status: column.id }))}
          className="p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Drop zone */}
      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 flex-1 min-h-[200px]">
          <AnimatePresence>
            {tasks.map((task) => (
              <SortableTaskCard key={task._id} task={task} />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed min-h-[120px]"
              style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-center">
                <Plus size={20} className="mx-auto mb-1 opacity-50" />
                <p className="text-xs">Drop tasks here</p>
              </div>
            </motion.div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
