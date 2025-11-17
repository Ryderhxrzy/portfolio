import React from 'react';
import './styles/AdminPage.css';

const Clients = () => {
  return (
    <main className="admin-content">
      <div className="content-header">
        <h1>Clients</h1>
        <p>Manage your client relationships and information</p>
      </div>

      <div className="page-content">
        <div className="placeholder-card">
          <i className="fas fa-users"></i>
          <h2>Client Management</h2>
          <p>This section will contain client relationship management features.</p>
          <ul>
            <li>Add new clients</li>
            <li>View client profiles</li>
            <li>Manage client communications</li>
            <li>Track client interactions</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Clients;
