
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Astra-Grid API"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_scan_endpoint():
    response = client.post(
        "/api/v1/scanner/scan",
        json={"sector": "B4-SECTOR-01", "priority": "high"}
    )
    assert response.status_code == 200
    assert "scan_id" in response.json()

def test_get_scans():
    response = client.get("/api/v1/scanner/scans")
    assert response.status_code == 200
    assert "scans" in response.json()

def test_agent_status():
    response = client.get("/api/v1/agents/status")
    assert response.status_code == 200
    assert "agents" in response.json()
    assert len(response.json()["agents"]) == 4

def test_analytics_performance():
    response = client.get("/api/v1/analytics/performance")
    assert response.status_code == 200
    assert "ocr_accuracy" in response.json()

def test_analytics_roi():
    response = client.get("/api/v1/analytics/roi")
    assert response.status_code == 200
    assert "annual_savings" in response.json()

def test_twin_components():
    response = client.get("/api/v1/twin/components")
    assert response.status_code == 200
    assert "components" in response.json()

def test_twin_sync():
    response = client.post("/api/v1/twin/sync")
    assert response.status_code == 200
    assert response.json()["status"] == "synced"
