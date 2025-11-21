/**
 * Global application context for state management
 * Manages expenses data, authentication state, and theme
 * 
 * TODO: Replace with Redux/Context API + backend API calls
 * TODO: Implement real authentication with JWT tokens
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { expensesData } from '../data/expenses.js';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Fake authentication state (stored in localStorage for persistence)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Expenses state (in real app, this would come from API)
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : expensesData;
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User profile data (dummy data)
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null // Placeholder for avatar
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Login function (fake authentication)
  const login = (email, password) => {
    // TODO: Replace with real API call
    // For now, just validate that fields are filled
    if (email && password) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    // TODO: Clear auth tokens, call logout API endpoint
  };

  // Add expense (dummy - would call API in real app)
  const addExpense = (expense) => {
    // TODO: Replace with API call
    const newExpense = {
      ...expense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  // Update expense (dummy - would call API in real app)
  const updateExpense = (id, updatedExpense) => {
    // TODO: Replace with API call
    setExpenses(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, ...updatedExpense } : exp))
    );
  };

  // Delete expense (dummy - would call API in real app)
  const deleteExpense = (id) => {
    // TODO: Replace with API call
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    expenses,
    setExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isDarkMode,
    setIsDarkMode,
    user,
    setUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};



