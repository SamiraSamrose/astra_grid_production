import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Robot3D from './components/Robot3D';
import MultiAgent from './components/MultiAgent';
import Telemetry from './components/Telemetry';
import Sandbox from './components/Sandbox';
import Compliance from './components/Compliance';
import Comparison from './components/Comparison';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import { agentsAPI } from './services/api';
import './styles/App.css';

function App() {
  const [systemStatus, setSystemStatus] = useState('operational');
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await agentsAPI.getStatus();
        setSystemStatus(response.data.status || 'operational');
      } catch (error) {
        console.error('Error fetching system status:', error);
        setSystemStatus('offline');
      }
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        <Header systemStatus={systemStatus} />
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/robot3d" element={<Robot3D />} />
            <Route path="/agents" element={<MultiAgent />} />
            <Route path="/telemetry" element={<Telemetry />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/advanced" element={<AdvancedAnalytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
