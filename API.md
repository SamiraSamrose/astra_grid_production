
# Astra-Grid API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication

All API endpoints (except health check) require JWT authentication.

### Obtain Token
```http
POST /api/v1/auth/token
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Using Token
Include token in Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Scanner Endpoints

### Initiate Scan
Start a new infrastructure scan.
```http
POST /api/v1/scanner/scan
Content-Type: application/json
Authorization: Bearer {token}

{
  "sector": "B4-SECTOR-01",
  "priority": "high"
}
```

**Response:**
```json
{
  "scan_id": "SCAN-B4-SECTOR-01-20240101120000",
  "sector": "B4-SECTOR-01",
  "components_found": 18,
  "status": "completed",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Get All Scans
Retrieve all scan results.
```http
GET /api/v1/scanner/scans
Authorization: Bearer {token}
```

**Response:**
```json
{
  "scans": [
    {
      "scan_id": "SCAN-B4-SECTOR-01-20240101120000",
      "sector": "B4-SECTOR-01",
      "components_found": 18,
      "status": "completed",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 1
}
```

### Get Specific Scan
Retrieve details of a specific scan.
```http
GET /api/v1/scanner/scans/{scan_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "scan_id": "SCAN-B4-SECTOR-01-20240101120000",
  "sector": "B4-SECTOR-01",
  "components": [
    {
      "component_id": "B4-SECTOR-01-COMP-001",
      "status": "Normal",
      "confidence": 0.95,
      "temperature": 45.2,
      "voltage": 230.5
    }
  ],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Agent Endpoints

### Get Agent Status
Get status of all agents.
```http
GET /api/v1/agents/status
Authorization: Bearer {token}
```

**Response:**
```json
{
  "agents": [
    {
      "name": "Infrastructure Scout",
      "status": "active",
      "last_activity": "2024-01-01T12:00:00Z",
      "tasks_completed": 156
    },
    {
      "name": "Network Analyst",
      "status": "active",
      "last_activity": "2024-01-01T12:00:00Z",
      "tasks_completed": 156
    },
    {
      "name": "Compliance Auditor",
      "status": "active",
      "last_activity": "2024-01-01T12:00:00Z",
      "tasks_completed": 156
    },
    {
      "name": "Web Orchestrator",
      "status": "active",
      "last_activity": "2024-01-01T12:00:00Z",
      "tasks_completed": 156
    }
  ]
}
```

### Execute Workflow
Execute complete multi-agent workflow.
```http
POST /api/v1/agents/execute
Content-Type: application/json
Authorization: Bearer {token}

{
  "sector": "B4-SECTOR-01"
}
```

**Response:**
```json
{
  "workflow_id": "WF-20240101120000",
  "sector": "B4-SECTOR-01",
  "workflow_status": "completed",
  "violations": 2,
  "components_analyzed": 18,
  "execution_time_seconds": 45.2
}
```

### WebSocket - Real-time Agent Communication
Connect to agent communication stream.
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/agents/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Agent message:', data);
};
```

**Message Format:**
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "agent": "Infrastructure Scout",
  "action": "Detected heat spike in Component-B4-SECTOR-01-2",
  "level": "warning",
  "metadata": {
    "component_id": "B4-SECTOR-01-COMP-002",
    "temperature": 82.5
  }
}
```

---

## Analytics Endpoints

### Get Performance Metrics
Retrieve system performance metrics.
```http
GET /api/v1/analytics/performance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "ocr_accuracy": 0.95,
  "sync_latency_ms": 85.3,
  "failure_prediction_accuracy": 0.94,
  "uptime_percentage": 99.7,
  "total_scans": 1567,
  "total_components": 28204
}
```

### Get Failure Predictions
Retrieve failure predictions.
```http
GET /api/v1/analytics/failures
Authorization: Bearer {token}
```

**Response:**
```json
{
  "predictions": [
    {
      "component_id": "B4-SECTOR-01-COMP-005",
      "risk_score": 0.85,
      "risk_category": "Critical",
      "time_to_failure_hours": 36.5,
      "predicted_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total_critical": 5,
  "total_warning": 12,
  "total_stable": 18197
}
```

### Get ROI Analysis
Retrieve return on investment analysis.
```http
GET /api/v1/analytics/roi
Authorization: Bearer {token}
```

**Response:**
```json
{
  "annual_savings": 150000,
  "roi_percentage": 450,
  "payback_period_years": 1.2,
  "total_investment": 500000,
  "downtime_reduction_hours": 612,
  "maintenance_cost_reduction": 280000
}
```

---

## Digital Twin Endpoints

### Get All Components
Retrieve all components in digital twin.
```http
GET /api/v1/twin/components
Authorization: Bearer {token}
```

**Query Parameters:**
- `sector` (optional): Filter by sector
- `status` (optional): Filter by status (Normal, Warning, Critical, Offline)
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 20)

**Response:**
```json
{
  "components": [
    {
      "id": 1,
      "component_id": "B4-SECTOR-01-COMP-001",
      "sector": "B4-SECTOR-01",
      "status": "Normal",
      "temperature": 45.2,
      "voltage": 230.5,
      "position_x": 12.5,
      "position_y": 3.2,
      "position_z": 1.0,
      "ocr_confidence": 0.95,
      "last_scanned": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 28204,
  "page": 1,
  "page_size": 20,
  "total_pages": 1411
}
```

### Get Specific Component
Retrieve details of a specific component.
```http
GET /api/v1/twin/components/{component_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "component_id": "B4-SECTOR-01-COMP-001",
  "sector": "B4-SECTOR-01",
  "status": "Normal",
  "temperature": 45.2,
  "voltage": 230.5,
  "current": 12.3,
  "position_x": 12.5,
  "position_y": 3.2,
  "position_z": 1.0,
  "ocr_confidence": 0.95,
  "last_scanned": "2024-01-01T12:00:00Z",
  "last_maintenance": "2023-11-15T10:30:00Z",
  "historical_data": [
    {
      "timestamp": "2024-01-01T11:00:00Z",
      "temperature": 44.8,
      "voltage": 230.2
    }
  ]
}
```

### Sync Digital Twin
Trigger digital twin synchronization.
```http
POST /api/v1/twin/sync
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "synced",
  "latency_ms": 85.3,
  "components_updated": 28204,
  "changes_detected": 47,
  "sync_timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Health & Status Endpoints

### Health Check
Check API health status.
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "astra-grid",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Database Health
Check database connectivity.
```http
GET /api/v1/health/database
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "pool_size": 10,
    "checked_out": 2,
    "overflow": 0
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid sector format. Expected format: XX-SECTOR-##",
  "error_code": "INVALID_INPUT"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials",
  "error_code": "UNAUTHORIZED"
}
```

### 404 Not Found
```json
{
  "detail": "Component not found",
  "error_code": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Rate limit exceeded. Please try again later.",
  "error_code": "RATE_LIMIT_EXCEEDED"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error",
  "error_code": "INTERNAL_ERROR"
}
```

---

## Rate Limits

- **Standard endpoints**: 100 requests per minute
- **Scan endpoints**: 10 requests per minute
- **Analytics endpoints**: 50 requests per minute
- **WebSocket connections**: 5 concurrent connections per user

---

## Webhooks

Configure webhooks to receive real-time notifications.

### Register Webhook
```http
POST /api/v1/webhooks
Content-Type: application/json
Authorization: Bearer {token}

{
  "url": "https://your-server.com/webhook",
  "events": ["scan.completed", "failure.predicted", "violation.detected"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload Example
```json
{
  "event": "failure.predicted",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "component_id": "B4-SECTOR-01-COMP-005",
    "risk_score": 0.85,
    "risk_category": "Critical",
    "time_to_failure_hours": 36.5
  }
}
```

---

## SDK Examples

### Python
```python
import requests

class AstraGridClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {token}"}
    
    def initiate_scan(self, sector, priority="medium"):
        response = requests.post(
            f"{self.base_url}/api/v1/scanner/scan",
            headers=self.headers,
            json={"sector": sector, "priority": priority}
        )
        return response.json()

client = AstraGridClient("http://localhost:8000", "your_token")
result = client.initiate_scan("B4-SECTOR-01", "high")
```

### JavaScript
```javascript
class AstraGridClient {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  
  async initiateScan(sector, priority = 'medium') {
    const response = await fetch(`${this.baseUrl}/api/v1/scanner/scan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sector, priority })
    });
    return await response.json();
  }
}

const client = new AstraGridClient('http://localhost:8000', 'your_token');
const result = await client.initiateScan('B4-SECTOR-01', 'high');
```
