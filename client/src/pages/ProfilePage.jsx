import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Lock, User, Save, AlertTriangle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, update, loading } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState({});

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await update({ name: profileForm.name, avatar: profileForm.avatar });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!pwdForm.currentPassword) errors.currentPassword = 'Required';
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 6) errors.newPassword = 'Min 6 characters';
    if (pwdForm.newPassword !== pwdForm.confirm) errors.confirm = 'Passwords do not match';
    setPwdErrors(errors);
    if (Object.keys(errors).length) return;
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password changed!');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setPwdLoading(false);
    }
  };

  const lbl = "block text-xs font-medium text-white/50 mb-1.5";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Profile</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account information.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><User size={16} className="text-primary-400" />Personal Info</h2>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <Avatar user={user} size="2xl" />
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(108,99,255,0.8)', border: '2px solid #0d0d1a' }}>
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user?.name}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div><label className={lbl}>Full Name</label><input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" /></div>
          <div><label className={lbl}>Avatar URL</label><input value={profileForm.avatar} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} className="input-field" placeholder="https://..." /></div>
          <Button type="submit" variant="primary" loading={loading} icon={Save}>Save Changes</Button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><Lock size={16} className="text-primary-400" />Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[['Current Password','currentPassword'],['New Password','newPassword'],['Confirm New','confirm']].map(([label, key]) => (
            <div key={key}>
              <label className={lbl}>{label}</label>
              <input type="password" value={pwdForm[key]} onChange={(e) => setPwdForm({ ...pwdForm, [key]: e.target.value })} className={`input-field ${pwdErrors[key] ? 'border-red-500/50' : ''}`} placeholder="••••••••" />
              {pwdErrors[key] && <p className="text-red-400 text-xs mt-1">{pwdErrors[key]}</p>}
            </div>
          ))}
          <Button type="submit" variant="primary" loading={pwdLoading} icon={Lock}>Change Password</Button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-6" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
        <h2 className="text-base font-semibold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={16} />Danger Zone</h2>
        <p className="text-sm text-white/40 mb-4">Permanently delete your account. This cannot be undone.</p>
        <Button variant="danger" onClick={() => toast.error('Contact support to delete your account.')}>Delete Account</Button>
      </motion.div>
    </div>
  );
}
