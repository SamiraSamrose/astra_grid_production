
import React, { useEffect, useRef } from 'react';
function Canvas3D() {
const iframeRef = useRef(null);
useEffect(() => {
if (iframeRef.current) {
iframeRef.current.src = 'http://localhost:8000/static/interactive_3d_infrastructure_canvas.html';
}
}, []);
return (
<div className="canvas-3d-container">
<h2>Live 3D Infrastructure Canvas</h2>
<iframe
ref={iframeRef}
title="3D Infrastructure"
style={{width: '100%', height: '800px', border: 'none'}}
/>
</div>
);
}
export default Canvas3D;
