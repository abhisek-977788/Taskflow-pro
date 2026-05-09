import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)' }}>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="text-[150px] font-black leading-none gradient-text select-none">404</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-2xl font-bold text-white mt-4 mb-2">Page not found</h1>
          <p className="text-white/40 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl">
              <Home size={16} /> Go to Dashboard
            </Link>
            <button onClick={() => window.history.back()} className="btn-ghost inline-flex items-center gap-2 px-6 py-3">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
