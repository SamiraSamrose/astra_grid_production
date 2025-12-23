
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
function Analytics() {
const [data, setData] = useState(null);
useEffect(() => {
fetch('http://localhost:8000/api/v1/analytics/roi')
.then(res => res.json())
.then(data => setData(data))
.catch(err => console.error(err));
}, []);
if (!data) return <div>Loading...</div>;
return (
<div className="analytics">
<h2>Analytics & ROI</h2>
<div className="analytics-grid">
<div className="chart">
<Plot
data={[{
values: [data.annual_savings, 500000],
labels: ['Savings', 'Investment'],
type: 'pie'
}]}
layout={{title: 'ROI Breakdown'}}
/>
</div>
</div>
</div>
);
}
export default Analytics;
