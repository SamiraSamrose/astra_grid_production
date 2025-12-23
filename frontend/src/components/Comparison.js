import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../styles/Comparison.css';

function Comparison() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const data = [{
      x: ['OCR', 'Prediction', 'Latency', 'Uptime'],
      y: [95.3, 94.2, 92, 99.5],
      name: 'Colab',
      type: 'bar',
      marker: {color: '#667eea'}
    }, {
      x: ['OCR', 'Prediction', 'Latency', 'Uptime'],
      y: [95.0, 94.0, 85, 99.7],
      name: 'Production',
      type: 'bar',
      marker: {color: '#764ba2'}
    }];

    setChartData(data);
  }, []);

  return (
    <div className="comparison-container">
      <h2>Colab Research vs Production System - Complete Results</h2>
      
      <div className="results-grid">
        <div className="result-card">
          <h4>Colab Research Results</h4>
          <div className="stats-panel">
            <div className="stats-row"><span>OCR Accuracy:</span><span>95.3%</span></div>
            <div className="stats-row"><span>Training Loss:</span><span>0.342</span></div>
            <div className="stats-row"><span>Prediction F1:</span><span>0.9421</span></div>
            <div className="stats-row"><span>Processing:</span><span>92ms avg</span></div>
          </div>
        </div>
        <div className="result-card">
          <h4>Production System Results</h4>
          <div className="stats-panel">
            <div className="stats-row"><span>OCR Accuracy:</span><span>95.0%</span></div>
            <div className="stats-row"><span>Inference:</span><span>85ms</span></div>
            <div className="stats-row"><span>Prediction:</span><span>94.0%</span></div>
            <div className="stats-row"><span>Uptime:</span><span>99.7%</span></div>
          </div>
        </div>
      </div>

      {chartData && (
        <div className="chart-container">
          <Plot
            data={chartData}
            layout={{
              title: 'Colab Research vs Production Performance',
              barmode: 'group',
              height: 500,
              autosize: true
            }}
            useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
          />
        </div>
      )}
    </div>
  );
}

export default Comparison;
