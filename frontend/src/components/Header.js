import React from 'react';
import '../styles/Header.css';

function Header({ systemStatus }) {
  return (
    <header className="app-header">
      <h1>Astra-Grid: Complete Interactive Demo</h1>
      <p>All Features & Advanced Analytics</p>
      <div className={`status-indicator ${systemStatus}`}>
        {systemStatus === 'operational' ? '● Online' : '● Offline'}
      </div>
    </header>
  );
}

export default Header;
