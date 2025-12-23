
import pytest
from app.services.ocr_service import OCRService
from app.services.ernie_service import ERNIEService
from app.services.agent_service import AgentService
from app.services.bigquery_service import BigQueryService

@pytest.mark.asyncio
async def test_ocr_service_scan():
    service = OCRService()
    result = await service.scan_sector("B4-SECTOR-01")
    assert "scan_id" in result
    assert "components" in result

@pytest.mark.asyncio
async def test_ernie_service_generate():
    service = ERNIEService()
    result = await service.generate_response("Test prompt")
    assert isinstance(result, str)

@pytest.mark.asyncio
async def test_agent_service_workflow():
    service = AgentService()
    result = await service.execute_workflow("B4-SECTOR-01")
    assert result["workflow_status"] == "completed"

@pytest.mark.asyncio
async def test_bigquery_service_validate():
    service = BigQueryService()
    result = await service.validate_data("COMP-001", {"text": "test"})
    assert "valid" in result
