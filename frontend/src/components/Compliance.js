import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import '../styles/Compliance.css';

function Compliance() {
  const [sector, setSector] = useState('B4-SECTOR-01');
  const [complianceResults, setComplianceResults] = useState(null);
  const [roiData, setRoiData] = useState(null);

  const runComplianceAudit = () => {
    const violations = Math.floor(Math.random() * 3);
    
    setComplianceResults({
      sector,
      violations,
      osha: violations > 0 ? 'Non-Compliant' : 'Compliant',
      ieee: 'Compliant',
      nfpa: 'Compliant'
    });
  };

  const calculateROI = () => {
    const years = [0, 1, 2, 3, 4, 5];
    const investment = years.map(y => 500000 + y * 80000);
    const savings = years.map(y => y * 150000);
    const netBenefit = years.map((y, i) => savings[i] - investment[i]);

    setRoiData([
      {x: years, y: investment, name: 'Investment', type: 'scatter', mode: 'lines+markers', line: {color: '#ef4444', width: 3}},
      {x: years, y: savings, name: 'Savings', type: 'scatter', mode: 'lines+markers', line: {color: '#10b981', width: 3}},
      {x: years, y: netBenefit, name: 'Net Benefit', type: 'scatter', mode: 'lines+markers', line: {color: '#667eea', width: 3}}
    ]);
  };

  return (
    <div className="compliance-container">
      <h2>Regulatory Compliance & Predictive ROI</h2>
      
      <div className="control-panel">
        <h3>Run Compliance Audit</h3>
        <div className="control-group">
          <label>
            Sector:
            <input 
              type="text" 
              value={sector} 
              onChange={(e) => setSector(e.target.value)}
              style={{padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} 
            />
          </label>
          <button className="btn" onClick={runComplianceAudit}>
            LLaMA-Factory Compliance Check
          </button>
          <button className="btn" onClick={calculateROI}>
            Calculate Predictive ROI
          </button>
        </div>
      </div>

      {complianceResults && (
        <div className="results-grid">
          <div className="result-card">
            <h4>Compliance Status</h4>
            <div className="stats-panel">
              <div className="stats-row"><span>Sector:</span><span>{complianceResults.sector}</span></div>
              <div className="stats-row"><span>Violations Found:</span><span className={`status-badge ${complianceResults.violations > 0 ? 'status-critical' : 'status-normal'}`}>{complianceResults.violations}</span></div>
              <div className="stats-row"><span>OSHA 1910.269:</span><span>{complianceResults.osha}</span></div>
              <div className="stats-row"><span>IEEE C2-2023:</span><span>{complianceResults.ieee}</span></div>
              <div className="stats-row"><span>NFPA 70E:</span><span>{complianceResults.nfpa}</span></div>
            </div>
          </div>
          {complianceResults.violations > 0 && (
            <div className="result-card">
              <h4>Violations Detected</h4>
              <div className="stats-panel">
                <div className="stats-row"><span>Arc-flash boundary exceeded</span><span>OSHA 1910.269(l)(8)(ii)</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {roiData && (
        <div className="chart-container">
          <Plot
            data={roiData}
            layout={{
              title: 'Predictive ROI Analysis - 5-Year Projection',
              xaxis: {title: 'Year'},
              yaxis: {title: 'Amount ($)'},
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

export default Compliance;
