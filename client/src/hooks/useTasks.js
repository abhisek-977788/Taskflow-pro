import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchTasks,
  fetchStats,
  createTask as createTaskAction,
  updateTask as updateTaskAction,
  deleteTask as deleteTaskAction,
  reorderTasks as reorderTasksAction,
  setFilter,
  clearFilters,
} from '../store/slices/taskSlice';
import { closeTaskModal } from '../store/slices/uiSlice';

export default function useTasks() {
  const dispatch = useDispatch();
  const { items, stats, pagination, filters, loading, statsLoading } = useSelector((s) => s.tasks);

  const loadTasks = useCallback((params = {}) => {
    const cleanParams = {};
    const merged = { ...filters, ...params };
    Object.entries(merged).forEach(([k, v]) => { if (v) cleanParams[k] = v; });
    dispatch(fetchTasks(cleanParams));
  }, [dispatch, filters]);

  const loadStats = useCallback(() => dispatch(fetchStats()), [dispatch]);

  const create = useCallback(async (data) => {
    const result = await dispatch(createTaskAction(data));
    if (createTaskAction.fulfilled.match(result)) {
      toast.success('Task created!');
      dispatch(closeTaskModal());
      return result.payload;
    } else {
      toast.error(result.payload || 'Failed to create task');
    }
  }, [dispatch]);

  const update = useCallback(async (id, data) => {
    const result = await dispatch(updateTaskAction({ id, ...data }));
    if (updateTaskAction.fulfilled.match(result)) {
      toast.success('Task updated!');
      dispatch(closeTaskModal());
    } else {
      toast.error(result.payload || 'Failed to update task');
    }
  }, [dispatch]);

  const remove = useCallback(async (id) => {
    const result = await dispatch(deleteTaskAction(id));
    if (deleteTaskAction.fulfilled.match(result)) {
      toast.success('Task deleted');
    } else {
      toast.error(result.payload || 'Failed to delete task');
    }
  }, [dispatch]);

  const reorder = useCallback((tasks) => dispatch(reorderTasksAction(tasks)), [dispatch]);

  const updateFilter = useCallback((filter) => dispatch(setFilter(filter)), [dispatch]);
  const resetFilters = useCallback(() => dispatch(clearFilters()), [dispatch]);

  return { items, stats, pagination, filters, loading, statsLoading, loadTasks, loadStats, create, update, remove, reorder, updateFilter, resetFilters };
}
