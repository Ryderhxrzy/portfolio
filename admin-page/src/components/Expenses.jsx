import React from 'react';
import './styles/AdminPage.css';

const Expenses = () => {
  return (
    <main className="admin-content">
      <div className="content-header">
        <h1>Expenses</h1>
        <p>Manage and track your business expenses</p>
      </div>

      <div className="page-content">
        <div className="placeholder-card">
          <i className="fas fa-credit-card"></i>
          <h2>Expenses Management</h2>
          <p>This section will contain expense tracking and management features.</p>
          <ul>
            <li>Add new expenses</li>
            <li>View expense categories</li>
            <li>Generate expense reports</li>
            <li>Track expense trends</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Expenses;
