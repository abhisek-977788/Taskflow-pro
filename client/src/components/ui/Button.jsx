import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', loading = false, disabled = false, fullWidth = false,
  icon: Icon, className = '', ...props
}) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' };
  const base = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`;

  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    secondary: 'glass border border-white/10 text-white/80 hover:text-white hover:border-white/20',
    outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10',
  };

  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? <Icon size={16} /> : null}
      {children}
    </motion.button>
  );
}
