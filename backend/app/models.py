
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(String, unique=True, index=True)
    sector = Column(String, index=True)
    status = Column(String)
    temperature = Column(Float)
    voltage = Column(Float)
    position_x = Column(Float)
    position_y = Column(Float)
    position_z = Column(Float)
    ocr_confidence = Column(Float)
    last_scanned = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String, unique=True, index=True)
    sector = Column(String)
    components_scanned = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    scan_data = Column(JSON)

class FailurePrediction(Base):
    __tablename__ = "failure_predictions"

    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(String, index=True)
    risk_score = Column(Float)
    risk_category = Column(String)
    time_to_failure_hours = Column(Float, nullable=True)
    prediction_confidence = Column(Float)
    predicted_at = Column(DateTime, default=datetime.utcnow)

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String)
    action = Column(String)
    log_level = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSON)
