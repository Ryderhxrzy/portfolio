import React from 'react';
import './styles/Dashboard.css';

const Dashboard = () => {
  return (
    <main className="admin-content">
      <div className="content-header">
        <h1>Dashboard</h1>
        <p>Welcome to your admin dashboard</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">$45,678</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Total Clients</h3>
            <p className="stat-value">1,234</p>
            <span className="stat-change positive">+8.2%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <div className="stat-info">
            <h3>Expenses</h3>
            <p className="stat-value">$12,345</p>
            <span className="stat-change negative">-3.1%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>Growth Rate</h3>
            <p className="stat-value">23.4%</p>
            <span className="stat-change positive">+5.7%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h2>Revenue Overview</h2>
          <div className="chart-placeholder">
            <i className="fas fa-chart-bar"></i>
            <p>Chart will be displayed here</p>
          </div>
        </div>

        <div className="chart-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <p>New client registered</p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="activity-content">
                <p>Payment received</p>
                <span>4 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-file-invoice"></i>
              </div>
              <div className="activity-content">
                <p>Invoice generated</p>
                <span>1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
