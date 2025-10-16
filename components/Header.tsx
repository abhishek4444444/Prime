import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        Dual Image Fusion AI
      </h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-gray-900 transition-colors"
        aria-label="Toggle theme"
      >
        <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-6 h-6" />
      </button>
    </header>
  );
};
