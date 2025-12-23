
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './DigitalTwin.css';

function DigitalTwin() {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    fetchComponents();
    const interval = setInterval(syncDigitalTwin, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/twin/components');
      setComponents(response.data.components || []);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const syncDigitalTwin = async () => {
    try {
      setSyncStatus('syncing');
      const response = await axios.post('http://localhost:8000/api/v1/twin/sync');
      setSyncStatus('synced');
      setLastSync(new Date());
      fetchComponents();
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  const handleComponentClick = async (componentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/twin/components/${componentId}`);
      setSelectedComponent(response.data);
    } catch (error) {
      console.error('Error fetching component:', error);
    }
  };

  return (
    <div className="digital-twin">
      <div className="twin-header">
        <h2>Digital Twin - Real-time Synchronization</h2>
        <div className="sync-status">
          <span className={`status-dot ${syncStatus}`}></span>
          <span>Last Sync: {lastSync.toLocaleTimeString()}</span>
          <button onClick={syncDigitalTwin}>Sync Now</button>
        </div>
      </div>

      <div className="twin-layout">
        <div className="components-grid">
          {components.map(comp => (
            <div 
              key={comp.id}
              className={`component-card ${comp.status}`}
              onClick={() => handleComponentClick(comp.id)}
            >
              <h4>{comp.component_id}</h4>
              <div className="component-status">{comp.status}</div>
              <div className="component-metrics">
                <span>Temp: {comp.temperature}°C</span>
                <span>Voltage: {comp.voltage}V</span>
              </div>
            </div>
          ))}
        </div>

        {selectedComponent && (
          <div className="component-detail">
            <h3>Component Details</h3>
            <div className="detail-content">
              <p><strong>ID:</strong> {selectedComponent.component_id}</p>
              <p><strong>Status:</strong> {selectedComponent.status}</p>
              <p><strong>Position:</strong> ({selectedComponent.position_x}, {selectedComponent.position_y}, {selectedComponent.position_z})</p>
              <p><strong>OCR Confidence:</strong> {(selectedComponent.ocr_confidence * 100).toFixed(1)}%</p>
              <p><strong>Last Scanned:</strong> {new Date(selectedComponent.last_scanned).toLocaleString()}</p>
            </div>
            
            <div className="telemetry-chart">
              <Plot
                data={[{
                  x: [1, 2, 3, 4, 5, 6, 7],
                  y: [45, 47, 46, 49, 51, 48, 50],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Temperature',
                  line: {color: '#e74c3c'}
                }]}
                layout={{
                  title: '7-Day Temperature History',
                  xaxis: {title: 'Days Ago'},
                  yaxis: {title: 'Temperature (°C)'},
                  height: 300
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DigitalTwin;
