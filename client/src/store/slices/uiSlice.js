import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    taskModalOpen: false,
    editingTask: null,
    viewMode: 'kanban', // 'kanban' | 'list'
    notifications: [],
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarCollapsed: (state, action) => { state.sidebarCollapsed = action.payload; },
    openTaskModal: (state, action) => { state.taskModalOpen = true; state.editingTask = action.payload || null; },
    closeTaskModal: (state) => { state.taskModalOpen = false; state.editingTask = null; },
    setViewMode: (state, action) => { state.viewMode = action.payload; },
    addNotification: (state, action) => {
      state.notifications.unshift({ id: Date.now(), ...action.payload });
      if (state.notifications.length > 20) state.notifications.pop();
    },
    clearNotifications: (state) => { state.notifications = []; },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, openTaskModal, closeTaskModal, setViewMode, addNotification, clearNotifications, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
