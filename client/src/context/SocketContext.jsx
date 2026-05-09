import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { socketTaskCreated, socketTaskUpdated, socketTaskDeleted } from '../store/slices/taskSlice';
import { addNotification } from '../store/slices/uiSlice';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const { token, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setConnected(false);
    });

    socket.on('task:created', (task) => {
      dispatch(socketTaskCreated(task));
      dispatch(addNotification({ type: 'info', message: `New task created: "${task.title}"` }));
    });

    socket.on('task:updated', (task) => {
      dispatch(socketTaskUpdated(task));
    });

    socket.on('task:deleted', (data) => {
      dispatch(socketTaskDeleted(data));
      dispatch(addNotification({ type: 'warning', message: 'A task was deleted.' }));
    });

    socket.on('tasks:reordered', () => {
      // Tasks reordered by another user — could trigger a refresh
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token, dispatch]);

  const joinBoard = (boardId) => socketRef.current?.emit('join:board', boardId);
  const leaveBoard = (boardId) => socketRef.current?.emit('leave:board', boardId);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinBoard, leaveBoard }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
