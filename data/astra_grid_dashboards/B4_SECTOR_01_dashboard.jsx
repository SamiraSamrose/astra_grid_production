import React from 'react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AstraGridTwin_B4SECTOR01 = () => {
  const violationsData = [
    {
        "component": "Component-B4-SECTOR-01-1",
        "regulation": "IEC 61850",
        "risk": "High"
    },
    {
        "component": "Component-B4-SECTOR-01-2",
        "regulation": "IEEE C2-2023",
        "risk": "High"
    },
    {
        "component": "Component-B4-SECTOR-01-4",
        "regulation": "IEC 61850",
        "risk": "High"
    },
    {
        "component": "Component-B4-SECTOR-01-6",
        "regulation": "IEEE C2-2023",
        "risk": "High"
    }
];

  const complianceStats = {
    violations: 4,
    compliant: 2,
    total: 6
  };

  return (
    <div className="astra-grid-dashboard" style={{
      padding: '20px',
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        borderBottom: '2px solid #1e90ff',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          B4-SECTOR-01 Digital Twin
        </h1>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#ff4444',
          padding: '10px 20px',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          4 Critical Alerts
        </div>
        <div style={{ marginTop: '10px', color: '#888' }}>
          Deployed: 2025-12-22T23:27:51.596303
        </div>
      </header>

      <main>
        <section style={{ marginBottom: '30px' }}>
          <h2>Compliance Overview</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              backgroundColor: '#ff4444',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {complianceStats.violations}
              </div>
              <div>Violations</div>
            </div>
            <div style={{
              backgroundColor: '#44ff44',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#000'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {complianceStats.compliant}
              </div>
              <div>Compliant</div>
            </div>
            <div style={{
              backgroundColor: '#4444ff',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {complianceStats.total}
              </div>
              <div>Total Components</div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>Critical Violations</h2>
          <div style={{ marginTop: '20px' }}>
            {violationsData.map((violation, idx) => (
              <div key={idx} style={{
                backgroundColor: '#1a1a2e',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                borderLeft: '4px solid #ff4444'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {violation.component}
                </div>
                <div style={{ color: '#ff8888', marginTop: '5px' }}>
                  Regulation: {violation.regulation}
                </div>
                <div style={{ color: '#ffaa44', marginTop: '5px' }}>
                  Risk Level: {violation.risk}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>3D Infrastructure Visualization</h2>
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <div style={{ color: '#888' }}>
              [3D Canvas - Real-time Telemetry Feed]
            </div>
            <div style={{ color: '#888', marginTop: '10px' }}>
              Digital Twin Synchronized with Physical Infrastructure
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AstraGridTwin_B4SECTOR01;
