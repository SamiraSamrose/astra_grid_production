import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { analyticsAPI } from '../services/api';
import '../styles/Telemetry.css';

function Telemetry() {
  const [component, setComponent] = useState('B4-SECTOR-01-COMP-001');
  const [period, setPeriod] = useState('30 Days');
  const [telemetryData, setTelemetryData] = useState(null);
  const [stats, setStats] = useState(null);

  const loadTelemetryData = async () => {
    try {
      const days = parseInt(period);
      const dates = Array.from({length: days * 24}, (_, i) => i);
      const temps = dates.map((_, i) => 45 + (i / (days * 24)) * 20 + (Math.random() - 0.5) * 8);
      const voltages = dates.map(() => 220 + Math.random() * 15);
      const currents = dates.map(() => 10 + Math.random() * 8);

      const data = [
        {x: dates, y: temps, name: 'Temperature (°C)', yaxis: 'y', line: {color: '#ef4444', width: 2}},
        {x: dates, y: voltages, name: 'Voltage (V)', yaxis: 'y2', line: {color: '#3b82f6', width: 2}},
        {x: dates, y: currents, name: 'Current (A)', yaxis: 'y3', line: {color: '#10b981', width: 2}}
      ];

      setTelemetryData(data);

      const calculateStdDev = (arr) => {
        const avg = arr.reduce((a,b) => a+b) / arr.length;
        return Math.sqrt(arr.map(x => Math.pow(x - avg, 2)).reduce((a,b) => a+b) / arr.length);
      };

      setStats({
        avgTemp: (temps.reduce((a,b)=>a+b)/temps.length).toFixed(1),
        tempStdDev: calculateStdDev(temps).toFixed(2),
        avgVoltage: (voltages.reduce((a,b)=>a+b)/voltages.length).toFixed(1),
        voltageStdDev: calculateStdDev(voltages).toFixed(2),
        currentSpikes: currents.filter(c => c > 15).length
      });

    } catch (error) {
      console.error('Error loading telemetry data:', error);
    }
  };

  return (
    <div className="telemetry-container">
      <h2>Drill-Down Telemetry - 30-Day Historical Analysis</h2>
      <div className="control-panel">
        <h3>Select Component for Telemetry</h3>
        <div className="control-group">
          <label>
            Component ID:
            <select value={component} onChange={(e) => setComponent(e.target.value)}>
              <option>B4-SECTOR-01-COMP-001</option>
              <option>B4-SECTOR-01-COMP-005</option>
              <option>B4-SECTOR-02-COMP-003</option>
            </select>
          </label>
          <label>
            Time Period:
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>7 Days</option>
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
            </select>
          </label>
          <button className="btn" onClick={loadTelemetryData}>
            Load Telemetry
          </button>
        </div>
      </div>

      {telemetryData && (
        <div className="chart-container">
          <Plot
            data={telemetryData}
            layout={{
              title: `${component} - ${period} Telemetry History`,
              xaxis: {title: 'Hours Ago'},
              yaxis: {title: 'Temperature', side: 'left', color: '#ef4444'},
              yaxis2: {title: 'Voltage', side: 'right', overlaying: 'y', color: '#3b82f6'},
              yaxis3: {title: 'Current', side: 'right', overlaying: 'y', position: 0.95, color: '#10b981'},
              height: 500,
              autosize: true
            }}
            useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
          />
        </div>
      )}

      {stats && (
        <div className="telemetry-panel">
          <h4>Statistical Analysis</h4>
          <div className="stats-row"><span>Avg Temperature:</span><span>{stats.avgTemp}°C</span></div>
          <div className="stats-row"><span>Temp Std Dev:</span><span>{stats.tempStdDev}°C</span></div>
          <div className="stats-row"><span>Avg Voltage:</span><span>{stats.avgVoltage}V</span></div>
          <div className="stats-row"><span>Voltage Std Dev:</span><span>{stats.voltageStdDev}V</span></div>
          <div className="stats-row"><span>Current Spikes:</span><span>{stats.currentSpikes} events</span></div>
        </div>
      )}
    </div>
  );
}

export default Telemetry;
