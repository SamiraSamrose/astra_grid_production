import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MasterDashboard = () => {
  const [selectedSector, setSelectedSector] = useState(null);

  const aggregateMetrics = {
    "total_components_scanned": 18,
    "total_violations": 13,
    "total_critical_alerts": 3,
    "physical_digital_sync_status": "Complete"
};

  const sectors = [
    {
        "sector": "B4-SECTOR-01",
        "components_scanned": 6,
        "violations": 4,
        "compliant": 2,
        "dashboard_url": "https://astra-grid-twin.cloud/b4-sector-01.html"
    },
    {
        "sector": "B4-SECTOR-02",
        "components_scanned": 6,
        "violations": 4,
        "compliant": 2,
        "dashboard_url": "https://astra-grid-twin.cloud/b4-sector-02.html"
    },
    {
        "sector": "B4-SECTOR-03",
        "components_scanned": 6,
        "violations": 5,
        "compliant": 1,
        "dashboard_url": "https://astra-grid-twin.cloud/b4-sector-03.html"
    }
];

  const metricCards = [
    { label: 'Sectors Audited', value: 3, color: '#1e90ff' },
    { label: 'Components Scanned', value: aggregateMetrics.total_components_scanned, color: '#00d4ff' },
    { label: 'Total Violations', value: aggregateMetrics.total_violations, color: '#ff4444' },
    { label: 'Critical Alerts', value: aggregateMetrics.total_critical_alerts, color: '#ffaa44' }
  ];

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        textAlign: 'center',
        padding: '40px 0',
        borderBottom: '3px solid #1e90ff',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #1e90ff 0%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
           Astra-Grid: Autonomous Telecom & Data Center Guardian
        </h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>
          Master Control Dashboard - Unified Infrastructure Overview
        </p>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #44ff44 0%, #00aa00 100%)',
          color: '#000',
          padding: '12px 30px',
          borderRadius: '25px',
          fontWeight: 'bold'
        }}>
          ✓ Physical-Digital Synchronization Complete
        </div>
      </header>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        margin: '40px 0'
      }}>
        {metricCards.map((metric, idx) => (
          <div key={idx} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '35px',
            borderRadius: '15px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: metric.color,
              marginBottom: '10px'
            }}>
              {metric.value}
            </div>
            <div style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#aaa'
            }}>
              {metric.label}
            </div>
          </div>
        ))}
      </section>

      <section style={{ margin: '60px 0' }}>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '30px',
          color: '#1e90ff',
          borderLeft: '5px solid #1e90ff',
          paddingLeft: '20px'
        }}>
           Sector Breakdowns
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '25px'
        }}>
          {sectors.map((sector, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              padding: '25px',
              borderRadius: '12px',
              borderLeft: `4px solid ${sector.violations > 0 ? '#ff4444' : '#44ff44'}`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedSector(sector)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '22px' }}>{sector.sector}</h3>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: sector.violations > 0 ? '#ff4444' : '#44ff44',
                  color: '#000'
                }}>
                  {sector.violations > 0 ? `${sector.violations} Violations` : 'All Clear'}
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>Components</span>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#1e90ff' }}>
                    {sector.components_scanned}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>Violations</span>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#1e90ff' }}>
                    {sector.violations}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>Compliant</span>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#1e90ff' }}>
                    {sector.compliant}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{
        textAlign: 'center',
        color: '#666',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p>Dashboard Generated: 2025-12-22T23:33:45.061893</p>
        <p>System Status: {aggregateMetrics.physical_digital_sync_status}</p>
      </div>
    </div>
  );
};

export default MasterDashboard;
