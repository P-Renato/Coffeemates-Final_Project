// src/components/UserAvatar.tsx
import React from 'react';

interface UserAvatarProps {
  username?: string;
  profileImage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  username = 'User', 
  profileImage, 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(username);

  // Color based on username for consistent placeholder
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-yellow-100 text-yellow-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600'
  ];
  
  const colorIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const colorClass = colors[colorIndex];

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={username}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = `rounded-full flex items-center justify-center ${sizeClasses[size]} ${colorClass} ${className}`;
            fallback.textContent = initials;
            parent.appendChild(fallback);
          }
        }}
      />
    );
  }

  return (
    <div className={`rounded-full flex items-center justify-center font-semibold ${sizeClasses[size]} ${colorClass} ${className}`}>
      {initials}
    </div>
  );
};

export default UserAvatar;