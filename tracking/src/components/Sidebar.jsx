/**
 * Sidebar navigation component
 * Persistent sidebar for app routes with responsive behavior
 * Collapses to hamburger menu on small screens
 * 
 * TODO: Add real navigation guards and route protection
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faReceipt,
  faUser,
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/app/dashboard', icon: faHome, label: 'Dashboard' },
    { path: '/app/expenses', icon: faReceipt, label: 'Expenses' }
  ];

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Expense Tracker
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <FontAwesomeIcon icon={item.icon} className="w-5 h-5" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Section - Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Profile Link */}
        <Link
          to="/app/profile"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/app/profile')
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="w-5 h-5" aria-hidden="true" />
          <span>Profile</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none"
          aria-label="Logout"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Mobile: Hamburger menu with bottom sheet/drawer
  if (isMobile) {
    return (
      <>
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
        >
          <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-40 flex flex-col transform transition-transform"
              role="navigation"
              aria-label="Main navigation"
              style={{ zIndex: 40 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>

              <SidebarContent />
            </aside>
          </>
        )}
      </>
    );
  }

  // Desktop: Persistent sidebar
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30"
      role="navigation"
      aria-label="Main navigation"
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;

