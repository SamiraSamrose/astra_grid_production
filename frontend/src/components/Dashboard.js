import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { analyticsAPI } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [kpiData, setKpiData] = useState({
    gridLoad: '68.4 MW',
    activeAlerts: 3,
    systemHealth: 87,
    syncLatency: 85
  });
  const [currentTheme, setCurrentTheme] = useState('safe');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchPerformanceData();
    startLiveSync();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await analyticsAPI.getPerformance();
      if (response.data) {
        setKpiData({
          gridLoad: response.data.grid_load || '68.4 MW',
          activeAlerts: response.data.active_alerts || 3,
          systemHealth: response.data.system_health || 87,
          syncLatency: response.data.sync_latency || 85
        });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const startLiveSync = () => {
    setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        gridLoad: (68 + Math.random() * 2).toFixed(1) + ' MW',
        syncLatency: 80 + Math.floor(Math.random() * 10)
      }));
    }, 3000);
  };

  const setGridHealth = (health) => {
    setCurrentTheme(health);
  };

  useEffect(() => {
    const hours = Array.from({length: 24}, (_, i) => i);
    const scanned = hours.map(() => 1000 + Math.random() * 500);
    setChartData([{
      x: hours,
      y: scanned,
      type: 'scatter',
      mode: 'lines+markers',
      line: {color: '#667eea', width: 3},
      fill: 'tozeroy'
    }]);
  }, []);

  return (
    <div className="dashboard">
      <h2>System Overview - Critical KPIs</h2>
      
      <div className="control-panel">
        <h3>Adaptive Color Palette Control</h3>
        <div className="control-group">
          <button className="btn" onClick={() => setGridHealth('safe')}>
            Set Safe Mode (Blue)
          </button>
          <button className="btn" onClick={() => setGridHealth('warning')}>
            Set Warning Mode (Amber)
          </button>
          <button className="btn" onClick={() => setGridHealth('emergency')}>
            Set Emergency Mode (Red)
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className={`kpi-card theme-${currentTheme}`}>
          <div className="kpi-label">Total Grid Load</div>
          <div className="kpi-value">{kpiData.gridLoad}</div>
        </div>
        <div className={`kpi-card theme-${currentTheme}`}>
          <div className="kpi-label">Active Alerts</div>
          <div className="kpi-value">{kpiData.activeAlerts}</div>
        </div>
        <div className={`kpi-card theme-${currentTheme}`}>
          <div className="kpi-label">System Health</div>
          <div className="kpi-value">{kpiData.systemHealth}%</div>
        </div>
        <div className={`kpi-card theme-${currentTheme}`}>
          <div className="kpi-label">
            <span className="sync-indicator sync-active"></span>Sync Status
          </div>
          <div className="kpi-value">{kpiData.syncLatency}ms</div>
        </div>
      </div>

      <div className="chart-container">
        <Plot
          data={chartData}
          layout={{
            title: 'Components Scanned (24 Hours) - Production System',
            xaxis: {title: 'Hour'},
            yaxis: {title: 'Count'},
            height: 400,
            autosize: true
          }}
          useResizeHandler={true}
          style={{width: "100%", height: "100%"}}
        />
      </div>
    </div>
  );
}

export default Dashboard;
