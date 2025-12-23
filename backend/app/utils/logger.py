
import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from datetime import datetime
from typing import Optional

class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors for console output"""
    
    COLORS = {
        'DEBUG': '\033[36m',
        'INFO': '\033[32m',
        'WARNING': '\033[33m',
        'ERROR': '\033[31m',
        'CRITICAL': '\033[35m',
    }
    RESET = '\033[0m'
    
    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{log_color}{record.levelname}{self.RESET}"
        return super().format(record)

class AstraGridLogger:
    """Custom logger for Astra-Grid application"""
    
    def __init__(
        self,
        name: str = "astra_grid",
        log_level: str = "INFO",
        log_file: Optional[str] = None,
        log_dir: str = "./logs",
        max_bytes: int = 10485760,
        backup_count: int = 5,
        enable_console: bool = True,
        enable_file: bool = True
    ):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, log_level.upper()))
        self.logger.handlers.clear()
        
        log_format = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
        date_format = "%Y-%m-%d %H:%M:%S"
        
        if enable_console:
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(logging.DEBUG)
            console_formatter = ColoredFormatter(log_format, datefmt=date_format)
            console_handler.setFormatter(console_formatter)
            self.logger.addHandler(console_handler)
        
        if enable_file:
            Path(log_dir).mkdir(parents=True, exist_ok=True)
            
            if log_file is None:
                log_file = f"{name}_{datetime.now().strftime('%Y%m%d')}.log"
            
            log_path = Path(log_dir) / log_file
            
            file_handler = RotatingFileHandler(
                log_path,
                maxBytes=max_bytes,
                backupCount=backup_count
            )
            file_handler.setLevel(logging.DEBUG)
            file_formatter = logging.Formatter(log_format, datefmt=date_format)
            file_handler.setFormatter(file_formatter)
            self.logger.addHandler(file_handler)
            
            error_log_path = Path(log_dir) / f"{name}_error.log"
            error_handler = RotatingFileHandler(
                error_log_path,
                maxBytes=max_bytes,
                backupCount=backup_count
            )
            error_handler.setLevel(logging.ERROR)
            error_handler.setFormatter(file_formatter)
            self.logger.addHandler(error_handler)
    
    def debug(self, message: str, **kwargs):
        """Log debug message"""
        self.logger.debug(message, extra=kwargs)
    
    def info(self, message: str, **kwargs):
        """Log info message"""
        self.logger.info(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning message"""
        self.logger.warning(message, extra=kwargs)
    
    def error(self, message: str, exc_info: bool = False, **kwargs):
        """Log error message"""
        self.logger.error(message, exc_info=exc_info, extra=kwargs)
    
    def critical(self, message: str, exc_info: bool = True, **kwargs):
        """Log critical message"""
        self.logger.critical(message, exc_info=exc_info, extra=kwargs)
    
    def exception(self, message: str, **kwargs):
        """Log exception with traceback"""
        self.logger.exception(message, extra=kwargs)

logger = AstraGridLogger(
    name="astra_grid",
    log_level="INFO",
    enable_console=True,
    enable_file=True
)

def get_logger(name: str) -> AstraGridLogger:
    """Get logger instance for specific module"""
    return AstraGridLogger(name=name)

def log_function_call(func):
    """Decorator to log function calls"""
    def wrapper(*args, **kwargs):
        logger.debug(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        try:
            result = func(*args, **kwargs)
            logger.debug(f"{func.__name__} completed successfully")
            return result
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}", exc_info=True)
            raise
    return wrapper

def log_api_request(endpoint: str, method: str, status_code: int, duration: float):
    """Log API request details"""
    logger.info(
        f"API Request: {method} {endpoint} - Status: {status_code} - Duration: {duration:.3f}s"
    )

def log_model_inference(model_name: str, input_size: int, duration: float, success: bool):
    """Log model inference details"""
    status = "SUCCESS" if success else "FAILED"
    logger.info(
        f"Model Inference: {model_name} - Input Size: {input_size} - "
        f"Duration: {duration:.3f}s - Status: {status}"
    )

def log_database_query(query: str, duration: float, rows_affected: int):
    """Log database query details"""
    logger.debug(
        f"Database Query: {query[:100]}... - Duration: {duration:.3f}s - Rows: {rows_affected}"
    )

def log_agent_action(agent_name: str, action: str, result: str):
    """Log agent action"""
    logger.info(f"Agent Action: [{agent_name}] {action} -> {result}")

def log_scan_event(scan_id: str, sector: str, components_found: int):
    """Log scan event"""
    logger.info(f"Scan Event: {scan_id} - Sector: {sector} - Components: {components_found}")

def log_failure_prediction(component_id: str, risk_score: float, risk_category: str):
    """Log failure prediction"""
    logger.info(
        f"Failure Prediction: {component_id} - Risk Score: {risk_score:.2f} - "
        f"Category: {risk_category}"
    )
