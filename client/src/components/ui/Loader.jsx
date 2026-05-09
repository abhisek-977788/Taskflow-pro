import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
        <div className="absolute inset-1 rounded-full border border-transparent border-t-cyan-400/60 animate-spin" style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} />
      </div>
      {size !== 'sm' && (
        <p className="text-sm text-white/40 animate-pulse">Loading TaskFlow...</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: '#0d0d1a' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text mb-6">TaskFlow Pro</div>
            {spinner}
          </div>
        </motion.div>
      </div>
    );
  }

  return spinner;
}

export function SkeletonCard() {
  return (
    <div className="glass p-4 rounded-xl space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}
