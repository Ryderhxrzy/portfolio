/**
 * Theme Toggle component
 * Floating button for switching between light and dark mode
 * Similar to other projects in the portfolio
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import './styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useApp();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <FontAwesomeIcon icon={faSun} />
      ) : (
        <FontAwesomeIcon icon={faMoon} />
      )}
    </button>
  );
};

export default ThemeToggle;



