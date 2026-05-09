import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Bell, Palette, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme } = useTheme();
  const { user } = useSelector((s) => s.auth);
  const [notif, setNotif] = useState(user?.preferences?.notifications ?? true);
  const [saving, setSaving] = useState(false);

  const savePreferences = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { preferences: { theme, notifications: notif } });
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ icon: Icon, title, children }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
        <Icon size={16} className="text-primary-400" />{title}
      </h2>
      {children}
    </motion.div>
  );

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-all duration-300 relative ${checked ? 'bg-primary-500' : 'bg-white/10'}`}>
        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Customize your TaskFlow Pro experience.</p>
      </motion.div>

      <Section icon={Palette} title="Appearance">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-primary-500/50 bg-primary-500/10">
          <Moon size={18} className="text-primary-400" />
          <div>
            <p className="text-sm font-medium text-white">Dark Mode</p>
            <p className="text-xs text-white/40 mt-0.5">Currently active theme</p>
          </div>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-primary-300" style={{ background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)' }}>Active</span>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Toggle label="Enable notifications" desc="Get notified about task updates in real-time" checked={notif} onChange={() => setNotif(!notif)} />
        <Toggle label="Task reminders" desc="Receive reminders for upcoming due dates" checked={false} onChange={() => toast('Coming soon!')} />
        <Toggle label="Team activity" desc="Notifications for team members' actions" checked={true} onChange={() => toast('Coming soon!')} />
      </Section>

      <Section icon={Shield} title="Security">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-sm font-medium text-white/80">Two-Factor Authentication</p>
              <p className="text-xs text-white/40 mt-0.5">Add an extra layer of security</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full text-amber-400" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>Coming Soon</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-sm font-medium text-white/80">Active Sessions</p>
              <p className="text-xs text-white/40 mt-0.5">1 active session</p>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Sign out all</button>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button variant="primary" loading={saving} onClick={savePreferences}>Save All Settings</Button>
      </div>
    </div>
  );
}
