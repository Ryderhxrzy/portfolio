/**
 * Dashboard page component
 * Shows summary cards, expense chart, and recent transactions
 * 
 * TODO: Replace with real API calls to fetch dashboard data
 * TODO: Add date range selector for custom periods
 * TODO: Add export functionality
 */

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faTags,
  faArrowUp,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

const Dashboard = () => {
  const { expenses } = useApp();

  // Calculate summary statistics
  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter expenses for current month
    const thisMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= startOfMonth;
    });

    // Total expenses this month
    const totalThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Unique categories
    const uniqueCategories = new Set(expenses.map(exp => exp.category));
    const totalCategories = uniqueCategories.size;

    // Highest expense
    const highestExpense = expenses.length > 0
      ? expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0])
      : null;

    // Total expenses (all time)
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      totalThisMonth: parseFloat(totalThisMonth.toFixed(2)),
      totalCategories,
      highestExpense,
      totalExpenses: parseFloat(totalExpenses.toFixed(2))
    };
  }, [expenses]);

  // Prepare chart data - group by month
  const chartData = useMemo(() => {
    const monthMap = new Map();
    
    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: monthLabel, amount: 0 });
      }
      monthMap.get(monthKey).amount += exp.amount;
    });

    return Array.from(monthMap.values())
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      })
      .map(item => ({
        ...item,
        amount: parseFloat(item.amount.toFixed(2))
      }));
  }, [expenses]);

  // Get recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Dashboard" />
      
      <main className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-16 sm:pb-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Expenses This Month */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stats.totalThisMonth)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-blue-600 dark:text-blue-400 text-xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalCategories}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTags}
                  className="text-green-600 dark:text-green-400 text-xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Highest Expense */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Highest Expense</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.highestExpense ? formatCurrency(stats.highestExpense.amount) : '$0.00'}
                </p>
                {stats.highestExpense && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stats.highestExpense.category}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className="text-yellow-600 dark:text-yellow-400 text-xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faReceipt}
                  className="text-purple-600 dark:text-purple-400 text-xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expenses Over Time
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                <XAxis
                  dataKey="month"
                  className="text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  className="text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-color-gray-800)',
                    border: '1px solid var(--tw-color-gray-700)',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Expenses"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

