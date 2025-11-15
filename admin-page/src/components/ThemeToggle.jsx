import React from 'react';
import './styles/ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </button>
  );
};

export default ThemeToggle;
