import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/tasks', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load tasks');
  }
});

export const fetchStats = createAsyncThunk('tasks/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/tasks/stats');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load stats');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', taskData);
    return data.task;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, updates);
    return data.task;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
  }
});

export const reorderTasks = createAsyncThunk('tasks/reorder', async (tasks, { rejectWithValue }) => {
  try {
    await api.put('/tasks/reorder', { tasks });
    return tasks;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Reorder failed');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    stats: null,
    pagination: null,
    filters: { status: '', priority: '', category: '', search: '', sort: '-createdAt' },
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { status: '', priority: '', category: '', search: '', sort: '-createdAt' }; },
    // Real-time socket updates
    socketTaskCreated: (state, action) => {
      if (!state.items.find((t) => t._id === action.payload._id)) {
        state.items.unshift(action.payload);
      }
    },
    socketTaskUpdated: (state, action) => {
      const idx = state.items.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    socketTaskDeleted: (state, action) => {
      state.items = state.items.filter((t) => t._id !== action.payload._id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload.stats; })
      .addCase(fetchStats.rejected, (state) => { state.statsLoading = false; })

      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export const { setFilter, clearFilters, socketTaskCreated, socketTaskUpdated, socketTaskDeleted } = taskSlice.actions;
export default taskSlice.reducer;
