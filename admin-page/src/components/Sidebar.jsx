import React, { useState } from 'react';
import './styles/Sidebar.css';

const Sidebar = ({ activeItem, onItemClick, theme, isOpen, onLogout }) => {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'expenses', label: 'Expenses', icon: 'fas fa-credit-card' },
    { id: 'income', label: 'Income', icon: 'fas fa-money-bill-wave' },
    { id: 'clients', label: 'Clients', icon: 'fas fa-users' }
  ];

  const handleItemClick = (itemId) => {
    onItemClick(itemId);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => {}} // Overlay click handled by parent
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-cogs"></i>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="sidebar-menu-item">
                <button
                  className={`sidebar-menu-link ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <i className={item.icon}></i>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-admin-info">
            <i className="fas fa-user"></i>
            <span>Admin User</span>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
