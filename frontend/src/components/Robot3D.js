import React, { useState, useEffect, useRef } from 'react';
import { scannerAPI } from '../services/api';
import '../styles/Robot3D.css';

function Robot3D() {
  const [robotX, setRobotX] = useState(50);
  const [robotY, setRobotY] = useState(50);
  const [components, setComponents] = useState([]);
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [targetSector, setTargetSector] = useState('B4-SECTOR-01');
  const [ghostOverlay, setGhostOverlay] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [assetPanelOpen, setAssetPanelOpen] = useState(false);
  const canvasRef = useRef(null);
  const patrolIntervalRef = useRef(null);

  useEffect(() => {
    initializeCanvas();
    return () => {
      if (patrolIntervalRef.current) {
        clearInterval(patrolIntervalRef.current);
      }
    };
  }, []);

  const initializeCanvas = () => {
    const newComponents = [];
    const statuses = ['normal', 'warning', 'critical'];
    const colors = {normal: '#10b981', warning: '#f59e0b', critical: '#ef4444'};
    const emojis = {normal: '✓', warning: '⚠', critical: '❌'};

    for (let i = 0; i < 15; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 100 + col * 130;
      const y = 100 + row * 180;
      const status = statuses[Math.floor(Math.random() * 100) > 85 ? (Math.random() > 0.5 ? 2 : 1) : 0];
      
      newComponents.push({
        id: i,
        x,
        y,
        status,
        temp: 40 + Math.random() * 45,
        voltage: 220 + Math.random() * 20,
        color: colors[status],
        emoji: emojis[status]
      });
    }
    
    setComponents(newComponents);
    addLog('3D Infrastructure Canvas initialized with 15 components', 'normal');
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - 25;
    const y = event.clientY - rect.top - 25;

    setRobotX(x);
    setRobotY(y);
    addLog(`Point-to-Robot command: Moving to (${Math.round(x)}, ${Math.round(y)})`, 'normal');
  };

  const startAutonomousPatrol = async () => {
    if (isPatrolling) {
      addLog('Patrol already active', 'warning');
      return;
    }

    try {
      await scannerAPI.initiateScan(targetSector, 'high');
      setIsPatrolling(true);
      addLog(`Starting autonomous patrol of ${targetSector}`, 'normal');
      addLog('PaddleOCR-VL model loaded on RDK X5 edge device', 'normal');

      let targetIndex = 0;
      
      patrolIntervalRef.current = setInterval(() => {
        if (targetIndex >= components.length) {
          targetIndex = 0;
          addLog('Patrol cycle completed. Restarting...', 'normal');
        }

        const target = components[targetIndex];
        setRobotX(target.x);
        setRobotY(target.y);

        setTimeout(() => {
          const confidence = 0.75 + Math.random() * 0.24;
          
          if (confidence < 0.85) {
            addLog(`COMP-${String(target.id).padStart(3, '0')}: Low confidence ${(confidence * 100).toFixed(1)}% - Repositioning`, 'warning');
            setTimeout(() => {
              addLog(`COMP-${String(target.id).padStart(3, '0')}: Rescan complete - Confidence 94.2%`, 'normal');
            }, 600);
          } else {
            addLog(`COMP-${String(target.id).padStart(3, '0')}: Scanned - Temp ${target.temp.toFixed(1)}°C - Confidence ${(confidence * 100).toFixed(1)}%`, 'normal');
          }

          if (target.status === 'critical') {
            addLog(`ALERT: COMP-${String(target.id).padStart(3, '0')} CRITICAL - Notifying Analyst Agent`, 'critical');
          }
        }, 1000);

        targetIndex++;
      }, 2500);
    } catch (error) {
      console.error('Error starting patrol:', error);
      addLog('Failed to start patrol - Backend error', 'critical');
    }
  };

  const stopPatrol = () => {
    if (patrolIntervalRef.current) {
      clearInterval(patrolIntervalRef.current);
      patrolIntervalRef.current = null;
      setIsPatrolling(false);
      addLog('Patrol stopped', 'warning');
    }
  };

  const resetRobotPosition = () => {
    stopPatrol();
    setRobotX(50);
    setRobotY(50);
    addLog('Robot reset to initial position (50, 50)', 'normal');
  };

  const toggleGhostOverlay = () => {
    setGhostOverlay(!ghostOverlay);
    addLog(`Global Novita Ghost Overlay: ${!ghostOverlay ? 'ENABLED' : 'DISABLED'}`, 'normal');
    if (!ghostOverlay) {
      addLog('Novita API: Global reconstruction mode activated', 'normal');
    }
  };

  const openAssetPanel = (component) => {
    setSelectedComponent(component);
    setAssetPanelOpen(true);
    addLog(`Opened asset panel for COMP-${String(component.id).padStart(3, '0')}`, 'normal');
  };

  const addLog = (message, level) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      level
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  return (
    <div className="robot3d-container">
      <h2>Live 3D Infrastructure Canvas with Point-to-Robot Navigation</h2>
      
      <div className="control-panel">
        <h3>Robot Controls (RDK X5 Edge Device)</h3>
        <div className="control-group">
          <label>
            Target Sector:
            <select value={targetSector} onChange={(e) => setTargetSector(e.target.value)}>
              <option>B4-SECTOR-01</option>
              <option>B4-SECTOR-02</option>
              <option>B4-SECTOR-03</option>
            </select>
          </label>
          <button className="btn" onClick={startAutonomousPatrol}>
            Start Autonomous Patrol
          </button>
          <button className="btn btn-secondary" onClick={stopPatrol}>
            Stop Patrol
          </button>
          <button className="btn" onClick={resetRobotPosition}>
            Reset Position
          </button>
          <button className="btn" onClick={toggleGhostOverlay}>
            Toggle Ghost Overlay
          </button>
        </div>
        <p style={{marginTop: '10px', color: '#666'}}>
          <strong>Point-to-Robot Navigation:</strong> Click anywhere on the canvas to send robot to that location
        </p>
      </div>

      <div 
        ref={canvasRef}
        className="robot-canvas-3d" 
        onClick={handleCanvasClick}
      >
        <div className="grid-lines"></div>
        <div 
          className="robot" 
          style={{left: `${robotX}px`, top: `${robotY}px`}}
        >
          🤖
        </div>
        {components.map((comp) => (
          <div
            key={comp.id}
            className={`component-marker ${isPatrolling && robotX === comp.x && robotY === comp.y ? 'scanning' : ''}`}
            style={{
              left: `${comp.x}px`,
              top: `${comp.y}px`,
              background: comp.color
            }}
            onClick={(e) => {
              e.stopPropagation();
              openAssetPanel(comp);
            }}
          >
            {comp.emoji}
          </div>
        ))}
      </div>

      <div className="agent-feed">
        {logs.map((log, idx) => (
          <div key={idx} className={`agent-log ${log.level}`}>
            <span style={{color: '#94a3b8', fontSize: '11px'}}>{log.timestamp}</span> {log.message}
          </div>
        ))}
      </div>

      {assetPanelOpen && selectedComponent && (
        <div className="asset-panel open">
          <button className="asset-panel-close" onClick={() => setAssetPanelOpen(false)}>×</button>
          <div className="asset-content">
            <h2>Digital Birth Certificate</h2>
            <h3>Component B4-COMP-{String(selectedComponent.id).padStart(3, '0')}</h3>
            
            <div className="stats-panel">
              <h4>Component Details</h4>
              <div className="stats-row"><span>Status:</span><span className={`status-badge status-${selectedComponent.status}`}>{selectedComponent.status.toUpperCase()}</span></div>
              <div className="stats-row"><span>Position:</span><span>({Math.round(selectedComponent.x)}, {Math.round(selectedComponent.y)}, 1.5)</span></div>
              <div className="stats-row"><span>Temperature:</span><span>{selectedComponent.temp.toFixed(1)}°C</span></div>
              <div className="stats-row"><span>Voltage:</span><span>{selectedComponent.voltage.toFixed(1)}V</span></div>
              <div className="stats-row"><span>OCR Confidence:</span><span>94.2%</span></div>
              <div className="stats-row"><span>Scanned By:</span><span>PaddleOCR-VL on RDK X5</span></div>
            </div>

            <div className="stats-panel" style={{marginTop: '15px'}}>
              <h4>PDF Schematic Reference</h4>
              <p style={{color: '#666', fontSize: '13px'}}>Original schematic: fiber-optic-layout-b4-{String(selectedComponent.id).padStart(3, '0')}.pdf</p>
              <div style={{background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '10px'}}>
                <code style={{fontSize: '12px'}}>
                  # Component {String(selectedComponent.id).padStart(3, '0')} Layout<br/>
                  Type: Server Blade<br/>
                  Serial: SN-{10000 + selectedComponent.id}<br/>
                  Power: {selectedComponent.voltage.toFixed(0)}V / 15A
                </code>
              </div>
            </div>

            <div className="stats-panel" style={{marginTop: '15px'}}>
              <h4>Baidu AI Studio Visual Audit</h4>
              <p style={{color: '#666', fontSize: '13px'}}>High-resolution micro-fracture detection analysis</p>
              <div className="stats-row"><span>Structural Integrity:</span><span>{selectedComponent.status === 'critical' ? 'Micro-fracture detected' : 'No defects'}</span></div>
              <div className="stats-row"><span>Analysis Confidence:</span><span>96.8%</span></div>
            </div>

            {(selectedComponent.status === 'critical' || selectedComponent.status === 'warning') && (
              <>
                <div className="ghost-overlay-toggle" onClick={toggleGhostOverlay}>
                  {ghostOverlay ? '✓ Ghost Overlay Active' : 'Enable Ghost Overlay (Novita API)'}
                </div>
                <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                  {ghostOverlay ? 'Showing reconstructed perfect-condition imagery' : 'Click to overlay reconstructed imagery on damaged component'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Robot3D;
