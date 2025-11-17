import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ContentHeader from './components/ContentHeader';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Income from './components/Income';
import Clients from './components/Clients';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for development
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    // Close sidebar on mobile after page change
    if (window.innerWidth <= 1199) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      expenses: 'Expenses',
      income: 'Income',
      clients: 'Clients'
    };
    return titles[activePage] || 'Dashboard';
  };

  const renderActivePage = () => {
    const pageContent = (() => {
      switch (activePage) {
        case 'dashboard':
          return <Dashboard />;
        case 'expenses':
          return <Expenses />;
        case 'income':
          return <Income />;
        case 'clients':
          return <Clients />;
        default:
          return <Dashboard />;
      }
    })();

    return (
      <div className="page-wrapper">
        <ContentHeader
          title={getPageTitle()}
          onMenuToggle={toggleSidebar}
        />
        <div className="page-content-wrapper">
          {pageContent}
        </div>
      </div>
    );
  };

  // Comment out login check to show Dashboard by default for development
  // if (!isLoggedIn) {
  //   return (
  //     <div className="App">
  //       <Login onLogin={handleLogin} />
  //       <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
  //     </div>
  //   );
  // }

  return (
    <div className="App admin-layout">
      <div className="admin-container">
        <div className="admin-sidebar">
          <Sidebar
            activeItem={activePage}
            onItemClick={handlePageChange}
            theme={theme}
            isOpen={sidebarOpen}
            onLogout={handleLogout}
          />
        </div>
        <div className="admin-main">
          {renderActivePage()}
        </div>
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
