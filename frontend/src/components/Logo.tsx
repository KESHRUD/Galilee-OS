import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', animated = false }) => {
  const { theme } = useTheme();
  
  const dim = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64
  };

  const px = dim[size];
  const color = theme === 'galilee' ? '#22d3ee' : '#4f46e5';
  const color2 = theme === 'galilee' ? '#06b6d4' : '#6366f1';

  return (
    <div className={`relative flex items-center justify-center ${animated ? 'group' : ''}`}>
      <svg 
        width={px} 
        height={px} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${animated ? 'animate-pulse-slow' : ''}`}
      >
        <path 
          d="M50 5L93.3 30V80L50 105L6.7 80V30L50 5Z" 
          stroke={color} 
          strokeWidth="4" 
          strokeLinejoin="round"
          className="opacity-50"
        />
        <path 
          d="M50 20L80 37.3V72.7L50 90L20 72.7V37.3L50 20Z" 
          stroke={color2} 
          strokeWidth="4" 
          strokeLinejoin="round"
          fill={theme === 'galilee' ? 'rgba(6,182,212,0.1)' : 'rgba(79,70,229,0.1)'}
        />
        <path 
          d="M50 40V60M40 50H60" 
          stroke={color} 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        <circle cx="20" cy="37.3" r="4" fill={color} className={animated ? "animate-ping" : ""} style={{animationDuration: '3s'}} />
        <circle cx="80" cy="72.7" r="4" fill={color} className={animated ? "animate-ping" : ""} style={{animationDuration: '3s', animationDelay: '1.5s'}} />
      </svg>
      {/* Glow effect for Galilée Theme */}
      {theme === 'galilee' && (
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
      )}
    </div>
  );
};