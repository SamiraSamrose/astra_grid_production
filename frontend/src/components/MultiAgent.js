import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { agentsAPI } from '../services/api';
import websocketService from '../services/websocket';
import '../styles/MultiAgent.css';

function MultiAgent() {
  const [sector, setSector] = useState('B4-SECTOR-01');
  const [logs, setLogs] = useState([]);
  const [timelineData, setTimelineData] = useState(null);

  useEffect(() => {
    websocketService.connect();
    const unsubscribe = websocketService.subscribe((data) => {
      addLog(data.agent, data.message, data.level || 'normal');
    });

    return () => {
      unsubscribe();
      websocketService.disconnect();
    };
  }, []);

  const executeFullWorkflow = async () => {
    setLogs([]);
    
    try {
      const response = await agentsAPI.executeWorkflow(sector);
      
      const steps = [
        {agent: 'User', msg: `Audit request: ${sector}`, level: 'normal', delay: 0},
        {agent: 'Infrastructure Scout', msg: 'Initiating RDK X5 navigation', level: 'normal', delay: 500},
        {agent: 'Infrastructure Scout', msg: 'PaddleOCR-VL processing 18 components', level: 'normal', delay: 1500},
        {agent: 'Infrastructure Scout', msg: 'OCR average confidence: 92.4%', level: 'normal', delay: 2500},
        {agent: 'Network Analyst', msg: 'Analyzing with Unsloth ERNIE 4.5', level: 'normal', delay: 3500},
        {agent: 'Network Analyst', msg: 'Temperature trend detected: +0.5°C/day', level: 'warning', delay: 4500},
        {agent: 'Network Analyst', msg: 'PREDICTION: COMP-005 failure 82% within 48h', level: 'critical', delay: 5500},
        {agent: 'Compliance Auditor', msg: 'Running LLaMA-Factory compliance check', level: 'normal', delay: 6500},
        {agent: 'Compliance Auditor', msg: 'Checking OSHA 1910.269, IEEE C2-2023, NFPA 70E', level: 'normal', delay: 7500},
        {agent: 'Compliance Auditor', msg: 'VIOLATION: Arc-flash boundary exceeded', level: 'critical', delay: 8500},
        {agent: 'Compliance Auditor', msg: 'Citing OSHA 1910.269(l)(8)(ii)', level: 'critical', delay: 9500},
        {agent: 'Compliance Auditor', msg: 'Baidu AI Studio: Micro-fracture 1.2mm detected', level: 'warning', delay: 10500},
        {agent: 'Web Orchestrator', msg: 'Generating React dashboard with ERNIE 4.5', level: 'normal', delay: 11500},
        {agent: 'Web Orchestrator', msg: 'Integrating Novita reconstructed imagery', level: 'normal', delay: 12500},
        {agent: 'Web Orchestrator', msg: 'Dashboard deployed: astra-grid-twin.cloud/b4-01', level: 'normal', delay: 13500},
        {agent: 'System', msg: 'BigQuery validation: 18/18 components verified', level: 'normal', delay: 14500},
        {agent: 'System', msg: 'Workflow complete - Digital twin synchronized', level: 'normal', delay: 15500}
      ];

      steps.forEach(step => {
        setTimeout(() => {
          addLog(step.agent, step.msg, step.level);
        }, step.delay);
      });

      setTimeout(() => {
        renderAgentTimeline();
      }, 16000);

    } catch (error) {
      console.error('Error executing workflow:', error);
      addLog('System', 'Workflow execution failed - Backend error', 'critical');
    }
  };

  const addLog = (agent, message, level) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      agent,
      message,
      level
    };
    setLogs(prev => [...prev, newLog]);
  };

  const renderAgentTimeline = () => {
    const data = [{
      x: [0, 1.5, 3.5, 7.5, 11.5, 15.5],
      y: ['Start', 'Scout', 'Analyst', 'Auditor', 'Orchestrator', 'Complete'],
      type: 'scatter',
      mode: 'lines+markers',
      marker: {size: 12, color: '#667eea'},
      line: {width: 3}
    }];
    setTimelineData(data);
  };

  return (
    <div className="multi-agent-container">
      <h2>Multi-Agent System Coordination (CAMEL-AI Framework)</h2>
      
      <div className="control-panel">
        <h3>Execute Complete Audit Workflow</h3>
        <div className="control-group">
          <label>
            Audit Sector:
            <input 
              type="text" 
              value={sector} 
              onChange={(e) => setSector(e.target.value)}
              style={{padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} 
            />
          </label>
          <button className="btn" onClick={executeFullWorkflow}>
            Execute Multi-Agent Audit
          </button>
        </div>
      </div>

      <div className="agent-feed">
        {logs.map((log, idx) => (
          <div key={idx} className={`agent-log ${log.level}`}>
            <span style={{color: '#94a3b8', fontSize: '11px'}}>{log.timestamp}</span> 
            <span className="agent-name">[{log.agent}]</span> {log.message}
          </div>
        ))}
      </div>

      {timelineData && (
        <div className="chart-container">
          <Plot
            data={timelineData}
            layout={{
              title: 'Multi-Agent Workflow Timeline (seconds)',
              xaxis: {title: 'Time (s)'},
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

export default MultiAgent;
