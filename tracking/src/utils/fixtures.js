/**
 * Utility functions for generating and manipulating dummy expense data
 * Useful for testing and development
 * 
 * TODO: Remove this file when connecting to real backend
 */

import { categories } from '../data/expenses.js';

/**
 * Generate a new expense entry with random data
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} A new expense object
 */
export const generateExpense = (overrides = {}) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  
  const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const date = randomDate(threeMonthsAgo, now);
  const amount = Math.round((Math.random() * 200 + 10) * 100) / 100;
  
  const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    date: date.toISOString().split('T')[0],
    category: overrides.category || category,
    description: overrides.description || `Sample ${category} expense`,
    amount: overrides.amount || parseFloat(amount.toFixed(2)),
    ...overrides
  };
};

/**
 * Generate multiple expense entries
 * @param {number} count - Number of expenses to generate
 * @returns {Array} Array of expense objects
 */
export const generateExpenses = (count = 10) => {
  return Array.from({ length: count }, () => generateExpense());
};

/**
 * Shuffle an array of expenses (Fisher-Yates algorithm)
 * @param {Array} expenses - Array of expense objects
 * @returns {Array} Shuffled array
 */
export const shuffleExpenses = (expenses) => {
  const shuffled = [...expenses];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Regenerate expenses with new random dates and amounts
 * @param {Array} expenses - Array of expense objects
 * @returns {Array} New array with regenerated expenses
 */
export const regenerateExpenses = (expenses) => {
  return expenses.map(expense => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const randomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };
    const newDate = randomDate(threeMonthsAgo, now);
    const newAmount = Math.round((Math.random() * 200 + 10) * 100) / 100;
    
    return {
      ...expense,
      date: newDate.toISOString().split('T')[0],
      amount: parseFloat(newAmount.toFixed(2))
    };
  });
};



