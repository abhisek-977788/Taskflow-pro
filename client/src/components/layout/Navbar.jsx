import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Bell, Menu, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openTaskModal, clearNotifications } from '../../store/slices/uiSlice';
import { setFilter } from '../../store/slices/taskSlice';

import { useSocket } from '../../context/SocketContext';
import Avatar from '../ui/Avatar';

export default function Navbar({ onMobileMenuToggle, mobileMenuOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { notifications } = useSelector((s) => s.ui);
  const { connected } = useSocket() || {};
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 shrink-0"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,10,24,0.8)', backdropFilter: 'blur(12px)' }}
    >
      {/* Mobile menu toggle */}
      <button onClick={onMobileMenuToggle} className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="input-field pl-9 py-2 text-sm h-9"
          onChange={(e) => {
            const val = e.target.value;
            dispatch(setFilter({ search: val }));
            if (val.trim() && location.pathname !== '/tasks') {
              navigate('/tasks');
            }
          }}
        />
      </div>

      <div className="flex-1" />

      {/* Socket connection indicator */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs">
        <div className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
        <span className="text-white/30">{connected ? 'Live' : 'Offline'}</span>
      </div>

      {/* New Task */}
      <button
        onClick={() => dispatch(openTaskModal())}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{ background: 'rgba(108,99,255,0.2)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)' }}
      >
        <Plus size={14} /> New Task
      </button>


      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-400 ring-2 ring-[#0d0d1a]" />
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-12 w-72 rounded-xl overflow-hidden z-50"
              style={{ background: 'rgba(14,14,30,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={() => { dispatch(clearNotifications()); setNotifOpen(false); }} className="text-xs text-primary-400 hover:text-primary-300">
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-white/30 text-sm py-6">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <p className="text-sm text-white/80">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar */}
      <Avatar user={user} size="sm" />
    </header>
  );
}
