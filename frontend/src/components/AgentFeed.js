
import React, { useState, useEffect } from 'react';
import './AgentFeed.css';
function AgentFeed() {
const [logs, setLogs] = useState([]);
useEffect(() => {
const ws = new WebSocket('ws://localhost:8000/api/v1/agents/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setLogs(prev => [...prev, data].slice(-50));
};

return () => ws.close();
}, []);
return (
<div className="agent-feed">
<h2>Agent Interaction Feed</h2>
<div className="log-container">
{logs.map((log, idx) => (
<div key={idx} className={log-entry ${log.level}}>
<span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
<span className="log-agent">{log.agent}</span>
<span className="log-message">{log.message}</span>
</div>
))}
</div>
</div>
);
}
export default AgentFeed;
