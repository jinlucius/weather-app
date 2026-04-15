import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">🌜</span>
        <span className="brand-text">Mosam</span>
      </div>
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current & Hourly
        </button>
        <button
          className={`nav-tab ${activeTab === 'historical' ? 'active' : ''}`}
          onClick={() => setActiveTab('historical')}
        >
          Historical Analysis
        </button>
      </div>
    </nav>
  );
};

export default Navbar;