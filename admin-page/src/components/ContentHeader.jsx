import React from 'react';
import './styles/ContentHeader.css';

const ContentHeader = ({ title, onMenuToggle }) => {
  return (
    <header className="content-header">
      <div className="content-header-left">
        <button
          className="menu-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="content-header-right">
        {/* Additional header content can go here */}
      </div>
    </header>
  );
};

export default ContentHeader;
