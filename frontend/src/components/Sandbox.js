import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import '../styles/Sandbox.css';

function Sandbox() {
  const [markdown, setMarkdown] = useState(`# Sector Configuration: B4-SECTOR-01

## Component Status
| Component | Temperature | Voltage | Status |
|-----------|-------------|---------|--------|
| COMP-001  | 45.2°C      | 230V    | Normal |
| COMP-002  | 68.5°C      | 228V    | Warning |
| COMP-003  | 85.2°C      | 215V    | Critical |

## Load Configuration
- Increase load by: 40%
- Simulate cooling failure: Yes`);
  
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);

  const runScenarioSimulation = () => {
    const hasLoadIncrease = markdown.includes('40%');
    const hasCoolingFailure = markdown.includes('cooling failure: Yes');

    const failureProb = 0.15 + (hasLoadIncrease ? 0.35 : 0) + (hasCoolingFailure ? 0.40 : 0);
    const category = failureProb > 0.7 ? 'Critical' : (failureProb > 0.4 ? 'Warning' : 'Stable');

    setResults({
      failureProb: (failureProb * 100).toFixed(1),
      category,
      timeToFailure: failureProb > 0.7 ? '36 hours' : 'N/A',
      predictedDowntime: failureProb > 0.7 ? '48 hours' : '0 hours',
      loadImpact: hasLoadIncrease ? '+35% risk' : 'None',
      coolingImpact: hasCoolingFailure ? '+40% risk' : 'None',
      affectedComponents: hasLoadIncrease || hasCoolingFailure ? '3 critical' : '0'
    });

    setChartData([{
      values: [failureProb, 1 - failureProb],
      labels: ['Failure Risk', 'Stable'],
      type: 'pie',
      marker: {colors: ['#ef4444', '#10b981']}
    }]);
  };

  const resetScenario = () => {
    setMarkdown(`# Sector Configuration: B4-SECTOR-01

## Component Status
| Component | Temperature | Voltage | Status |
|-----------|-------------|---------|--------|
| COMP-001  | 45.2°C      | 230V    | Normal |
| COMP-002  | 68.5°C      | 228V    | Warning |
| COMP-003  | 85.2°C      | 215V    | Critical |`);
    setResults(null);
    setChartData(null);
  };

  return (
    <div className="sandbox-container">
      <h2>Synthetic Scenario Sandbox - What-If Analysis</h2>
      
      <div className="sandbox-panel">
        <h3>Edit Markdown Configuration</h3>
        <textarea 
          className="sandbox-textarea"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div style={{marginTop: '15px'}}>
          <button className="btn" onClick={runScenarioSimulation}>
            Run ERNIE Simulation
          </button>
          <button className="btn btn-secondary" onClick={resetScenario}>
            Reset Configuration
          </button>
        </div>
      </div>

      {results && (
        <div className="results-grid">
          <div className="result-card">
            <h4>Simulation Results</h4>
            <div className="stats-panel">
              <div className="stats-row"><span>Failure Probability:</span><span>{results.failureProb}%</span></div>
              <div className="stats-row"><span>Risk Category:</span><span className={`status-badge status-${results.category.toLowerCase()}`}>{results.category}</span></div>
              <div className="stats-row"><span>Time to Failure:</span><span>{results.timeToFailure}</span></div>
              <div className="stats-row"><span>Predicted Downtime:</span><span>{results.predictedDowntime}</span></div>
            </div>
          </div>
          <div className="result-card">
            <h4>Impact Analysis</h4>
            <div className="stats-panel">
              <div className="stats-row"><span>Load Increase Impact:</span><span>{results.loadImpact}</span></div>
              <div className="stats-row"><span>Cooling Failure Impact:</span><span>{results.coolingImpact}</span></div>
              <div className="stats-row"><span>Affected Components:</span><span>{results.affectedComponents}</span></div>
            </div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="chart-container">
          <Plot
            data={chartData}
            layout={{
              title: 'Scenario Risk Distribution',
              height: 400,
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

export default Sandbox;
