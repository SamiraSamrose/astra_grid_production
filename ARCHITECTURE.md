
# Astra-Grid System Architecture

## System Overview

Astra-Grid implements a multi-tier architecture combining edge computing, cloud services, and autonomous agents.

## Architecture Diagram

┌─────────────────────────────────────────────────────────────┐
│                    Physical Infrastructure                  │
│  (Data Centers, Telecom Towers, Server Racks)               │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              D-Robotics RDK X5 (Edge)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PaddleOCR-VL  │  Local Processing  │  Zero Latency  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                  Multi-Agent System (CAMEL-AI)              │
│  ┌────────────┬────────────┬──────────────┬──────────────┐  │
│  │   Scout    │  Analyst   │   Auditor    │ Orchestrator │  │
│  └────────────┴────────────┴──────────────┴──────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                   Backend Services (FastAPI)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ERNIE Models  │  BigQuery  │  APIs  │  WebSockets     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                   Frontend (React)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  3D Canvas  │  Dashboard  │  Analytics  │  Agent Feed  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

## Component Details

## Edge Layer

- Hardware: D-Robotics RDK X5
- OCR: PaddleOCR-VL (fine-tuned)
- Processing: Local inference, zero cloud latency

## Agent Layer

- Framework: CAMEL-AI
- Agents: Scout, Analyst, Auditor, Orchestrator
- Communication: A2A Protocol

## Service Layer

- API: FastAPI with async support
- Database: PostgreSQL + BigQuery
- Models: ERNIE 4.5 (Unsloth + LLaMA-Factory)

## Presentation Layer

- Frontend: React 18
- Visualization: Plotly.js, WebGL
- Real-time: WebSocket connections

## Data Flow

- RDK X5 scans physical infrastructure
- PaddleOCR-VL extracts text/layout
- Scout agent validates confidence
- Analyst agent predicts failures
- Auditor agent checks compliance
- Orchestrator generates digital twin
- ContinueDec 17
- BigQuery validates against truth
- Frontend updates in real-time

## Scalability

- Horizontal: Multiple RDK X5 robots
- Vertical: GPU/TPU acceleration
- Database: Sharding + replication
- Cache: Redis for hot data

## Security

- JWT authentication
- API key management
- Database encryption
- HTTPS/WSS only
