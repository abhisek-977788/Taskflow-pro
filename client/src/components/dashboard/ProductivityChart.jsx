import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-4 py-3 rounded-xl text-sm" style={{ border: '1px solid rgba(108,99,255,0.3)' }}>
      <p className="text-white/60 text-xs mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function ProductivityChart({ data = [] }) {
  const chartData = data.length > 0 ? data.map((d) => ({
    date: d._id ? new Date(d._id).toLocaleDateString('en', { weekday: 'short' }) : d.date,
    Created: d.created || 0,
    Completed: d.completed || 0,
  })) : generateMockData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Productivity Overview</h3>
          <p className="text-xs text-white/40 mt-0.5">Tasks created & completed (last 7 days)</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-white/50"><span className="h-2 w-2 rounded-full bg-primary-500" />Created</span>
          <span className="flex items-center gap-1.5 text-white/50"><span className="h-2 w-2 rounded-full bg-emerald-400" />Completed</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Created" stroke="#6c63ff" strokeWidth={2} fill="url(#createdGrad)" dot={false} activeDot={{ r: 4, fill: '#6c63ff' }} />
          <Area type="monotone" dataKey="Completed" stroke="#34d399" strokeWidth={2} fill="url(#completedGrad)" dot={false} activeDot={{ r: 4, fill: '#34d399' }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function generateMockData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((d) => ({ date: d, Created: Math.floor(Math.random() * 8) + 1, Completed: Math.floor(Math.random() * 6) }));
}
