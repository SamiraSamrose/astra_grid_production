import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation({ activeView, setActiveView }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'overview', label: 'System Overview', path: '/overview' },
    { id: 'robot3d', label: '3D Robot Canvas', path: '/robot3d' },
    { id: 'agents', label: 'Multi-Agent System', path: '/agents' },
    { id: 'telemetry', label: 'Drill-Down Telemetry', path: '/telemetry' },
    { id: 'sandbox', label: 'Scenario Sandbox', path: '/sandbox' },
    { id: 'compliance', label: 'Compliance & ROI', path: '/compliance' },
    { id: 'comparison', label: 'Colab vs Production', path: '/comparison' },
    { id: 'advanced', label: 'Advanced Analytics', path: '/advanced' }
  ];

  const handleTabClick = (tab) => {
    setActiveView(tab.id);
    navigate(tab.path);
  };

  return (
    <nav className="app-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={location.pathname === tab.path ? 'active' : ''}
          onClick={() => handleTabClick(tab)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
