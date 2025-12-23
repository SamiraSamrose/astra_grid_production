
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
from typing import List
import asyncio

from app.api.routes import scanner, agents, analytics, twin
from app.config import settings
from app.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Astra-Grid Production Server")
    yield
    logger.info("Shutting down Astra-Grid Production Server")

app = FastAPI(
    title="Astra-Grid API",
    description="Autonomous Telecom & Data Center Guardian",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scanner.router, prefix="/api/v1/scanner", tags=["scanner"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(twin.router, prefix="/api/v1/twin", tags=["digital-twin"])

@app.get("/")
async def root():
    return {
        "message": "Astra-Grid API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "astra-grid"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS
    )
