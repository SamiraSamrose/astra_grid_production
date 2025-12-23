
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from app.services.agent_service import AgentService

router = APIRouter()

@router.websocket("/ws")
async def agent_websocket(websocket: WebSocket):
    """WebSocket for real-time agent communication"""
    await websocket.accept()
    agent_service = AgentService()
    
    try:
        while True:
            data = await websocket.receive_json()
            response = await agent_service.process_command(data)
            await websocket.send_json(response)
    except WebSocketDisconnect:
        pass

@router.get("/status")
async def get_agent_status():
    """Get status of all agents"""
return {
"agents": [
{"name": "Infrastructure Scout", "status": "active"},
{"name": "Network Analyst", "status": "active"},
{"name": "Compliance Auditor", "status": "active"},
{"name": "Web Orchestrator", "status": "active"}
]
}
@router.post("/execute")
async def execute_workflow(sector: str):
"""Execute complete multi-agent workflow"""
agent_service = AgentService()
result = await agent_service.execute_workflow(sector)
return result
