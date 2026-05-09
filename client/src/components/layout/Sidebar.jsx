import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Kanban, User, Settings, LogOut, ChevronLeft,
  Zap, Plus, Bell, CheckSquare
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { openTaskModal, toggleSidebar } from '../../store/slices/uiSlice';
import Avatar from '../ui/Avatar';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks',     label: 'Task Board', icon: Kanban },
  { to: '/profile',   label: 'Profile',    icon: User },
  { to: '/settings',  label: 'Settings',   icon: Settings },
];

export default function Sidebar({ collapsed, onCollapse }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { notifications } = useSelector((s) => s.ui);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('See you soon! 👋');
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative h-screen flex flex-col shrink-0 overflow-hidden"
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #3ec6e0)' }}>
          <CheckSquare size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="overflow-hidden">
              <span className="text-sm font-bold gradient-text whitespace-nowrap">TaskFlow Pro</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add Task */}
      <div className="px-3 py-3">
        <button
          onClick={() => dispatch(openTaskModal())}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
          style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)', color: '#a78bfa' }}
        >
          <Plus size={16} className="shrink-0 group-hover:rotate-90 transition-transform duration-200" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                New Task
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'shadow-[inset_0_0_0_1px_rgba(108,99,255,0.3)]'
                  : ''
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--nav-link-active)' : '',
              color: 'var(--nav-link-color)',
            })}
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onCollapse}
        className="absolute top-5 -right-3 h-6 w-6 rounded-full flex items-center justify-center z-10 transition-colors"
        style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={12} />
        </motion.div>
      </button>

      {/* User + Logout */}
      <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
          <Avatar user={user} size="sm" className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
