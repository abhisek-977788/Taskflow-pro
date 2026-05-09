import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await login({ email: form.email, password: form.password });
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0f3460 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #3ec6e0)' }}>
              <CheckSquare size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">TaskFlow Pro</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">Welcome back to your workspace</h1>
          <p className="text-white/50 text-lg leading-relaxed">Manage your tasks, track progress, and collaborate with your team in real-time.</p>
          <div className="mt-10 space-y-4">
            {['Kanban board with drag & drop', 'Real-time team collaboration', 'Productivity analytics'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/60">
                <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(108,99,255,0.2)' }}>
                  <ArrowRight size={12} className="text-primary-400" />
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(108,99,255,0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #3ec6e0)' }}>
                <CheckSquare size={16} className="text-white" />
              </div>
              <span className="text-base font-bold gradient-text">TaskFlow Pro</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
            <p className="text-white/40 text-sm mb-7">Enter your credentials to access your workspace</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com" className={`input-field pl-9 ${errors.email ? 'border-red-500/50' : ''}`} />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-500/50' : ''}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    className="w-4 h-4 rounded accent-primary-500" />
                  <span className="text-xs text-white/50">Remember me</span>
                </label>
                <button type="button" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</button>
              </div>

              <Button type="submit" variant="primary" loading={loading} fullWidth size="lg">
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Create one free</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
