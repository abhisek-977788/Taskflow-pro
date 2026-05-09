import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, ArrowRight, Zap, Shield, Users, BarChart3, Kanban, Bell } from 'lucide-react';

const features = [
  { icon: Kanban,   title: 'Kanban Board',     desc: 'Drag & drop tasks across status columns in real-time.' },
  { icon: Zap,      title: 'Real-time Sync',   desc: 'Socket.io powered live updates across all team members.' },
  { icon: BarChart3,title: 'Analytics',        desc: 'Track productivity trends with beautiful charts.' },
  { icon: Shield,   title: 'Secure Auth',      desc: 'JWT authentication with bcrypt password hashing.' },
  { icon: Users,    title: 'Team Collaboration', desc: 'Multi-user real-time task management and assignment.' },
  { icon: Bell,     title: 'Smart Notifications', desc: 'Live notifications for task updates and deadlines.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0f3460 100%)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #3ec6e0)' }}>
            <CheckSquare size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">TaskFlow Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm px-5 py-2 rounded-xl">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#a78bfa' }}>
            <Zap size={12} /> Real-time multi-user collaboration powered by Socket.io
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="text-white">Manage Tasks</span>
            <br />
            <span className="gradient-text">Like a Pro Team</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            A premium, production-ready task management platform inspired by Linear, Notion, and Jira. 
            Built with React, Node.js, MongoDB, and Socket.io.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary px-8 py-4 text-base rounded-xl inline-flex items-center gap-2">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="px-8 py-4 text-base rounded-xl inline-flex items-center gap-2 glass hover:bg-white/10 transition-all font-semibold">
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 relative"
        >
          <div className="glass rounded-2xl p-6 max-w-4xl mx-auto overflow-hidden"
            style={{ border: '1px solid rgba(108,99,255,0.2)', boxShadow: '0 40px 120px rgba(108,99,255,0.15)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-xs text-white/30 ml-2">TaskFlow Pro — Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[{label:'Total Tasks',val:'48',color:'#6c63ff'},{label:'Completed',val:'31',color:'#34d399'},{label:'In Progress',val:'12',color:'#a78bfa'}].map((s) => (
                <div key={s.label} className="p-4 rounded-xl text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {['To Do','In Progress','Completed'].map((col, i) => (
                <div key={col} className="flex-1 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-xs font-semibold text-white/50 mb-2">{col}</div>
                  {[1,2].map((n) => (
                    <div key={n} className="h-8 rounded-lg mb-1.5" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-white/50 text-lg">Enterprise-grade features in a beautiful, fast interface.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={itemVariants} className="glass-hover p-6 rounded-2xl">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.2)' }}>
                <Icon size={22} className="text-primary-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-3xl p-12" style={{ border: '1px solid rgba(108,99,255,0.2)', boxShadow: '0 0 80px rgba(108,99,255,0.1)' }}>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to ship faster?</h2>
          <p className="text-white/50 mb-8">Join teams building great products with TaskFlow Pro.</p>
          <Link to="/register" className="btn-primary px-10 py-4 text-base rounded-xl inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 text-center">
        <p className="text-white/30 text-sm">© 2024 TaskFlow Pro. Built with ❤️ using React, Node.js & MongoDB.</p>
      </footer>
    </div>
  );
}
