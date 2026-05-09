import React from 'react';
import { getInitials, generateAvatarUrl } from '../../utils/helpers';

export default function Avatar({ user, size = 'md', className = '' }) {
  const sizes = { xs: 'h-6 w-6 text-xs', sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-lg', '2xl': 'h-24 w-24 text-2xl' };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary-500/30 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold ring-2 ring-primary-500/30 ${className}`}
      style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #3ec6e0 100%)' }}
    >
      {user ? getInitials(user.name) : '?'}
    </div>
  );
}
