import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card"
    >
      {/* Background glow */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-10 blur-xl" style={{ background: color }} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
            <Icon size={20} style={{ color }} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trendValue || trend)}%
            </div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {value}
        </motion.p>
        <p className="text-sm text-white/50">{title}</p>
      </div>
    </motion.div>
  );
}
