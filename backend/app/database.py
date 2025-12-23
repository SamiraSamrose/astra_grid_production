
from sqlalchemy import create_engine, event, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
from typing import Generator
import logging
from app.config import settings

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_conn, connection_record):
    """Set SQLite pragmas for better performance"""
    if "sqlite" in settings.DATABASE_URL:
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=10000")
        cursor.execute("PRAGMA temp_store=MEMORY")
        cursor.close()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    Yields a session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

@contextmanager
def get_db_context():
    """
    Context manager for database sessions.
    Usage: with get_db_context() as db: ...
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        logger.error(f"Database context error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

def drop_db():
    """Drop all database tables"""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
    except Exception as e:
        logger.error(f"Error dropping database tables: {e}")
        raise

def reset_db():
    """Reset database by dropping and recreating all tables"""
    try:
        drop_db()
        init_db()
        logger.info("Database reset successfully")
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        raise

class DatabaseManager:
    """Database connection and query manager"""
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def execute_query(self, query: str, params: dict = None):
        """Execute raw SQL query"""
        with get_db_context() as db:
            try:
                if params:
                    result = db.execute(query, params)
                else:
                    result = db.execute(query)
                return result.fetchall()
            except Exception as e:
                logger.error(f"Query execution error: {e}")
                raise
    
    def get_table_count(self, table_name: str) -> int:
        """Get row count for a table"""
        query = f"SELECT COUNT(*) FROM {table_name}"
        result = self.execute_query(query)
        return result[0][0] if result else 0
    
    def check_connection(self) -> bool:
        """Check database connection"""
        try:
            with get_db_context() as db:
                db.execute("SELECT 1")
            return True
        except Exception as e:
            logger.error(f"Database connection check failed: {e}")
            return False
    
    def get_database_info(self) -> dict:
        """Get database information"""
        return {
            "url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL,
            "pool_size": engine.pool.size(),
            "checked_out": engine.pool.checkedout(),
            "overflow": engine.pool.overflow(),
            "connected": self.check_connection()
        }

db_manager = DatabaseManager()

async def check_db_health() -> dict:
    """Health check for database"""
    try:
        is_healthy = db_manager.check_connection()
        info = db_manager.get_database_info()
        
        return {
            "status": "healthy" if is_healthy else "unhealthy",
            "database": info
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

class AsyncDatabaseSession:
    """Async context manager for database sessions"""
    
    def __init__(self):
        self.db = None
    
    async def __aenter__(self):
        self.db = SessionLocal()
        return self.db
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            await self.db.rollback()
        else:
            await self.db.commit()
        await self.db.close()

def bulk_insert(model_class, data_list: list):
    """Bulk insert records"""
    with get_db_context() as db:
        try:
            objects = [model_class(**data) for data in data_list]
            db.bulk_save_objects(objects)
            logger.info(f"Bulk inserted {len(data_list)} records into {model_class.__tablename__}")
        except Exception as e:
            logger.error(f"Bulk insert error: {e}")
            raise

def bulk_update(model_class, data_list: list, id_field: str = "id"):
    """Bulk update records"""
    with get_db_context() as db:
        try:
            db.bulk_update_mappings(model_class, data_list)
            logger.info(f"Bulk updated {len(data_list)} records in {model_class.__tablename__}")
        except Exception as e:
            logger.error(f"Bulk update error: {e}")
            raise

def truncate_table(table_name: str):
    """Truncate table"""
    with get_db_context() as db:
        try:
            db.execute(f"TRUNCATE TABLE {table_name}")
            logger.info(f"Truncated table: {table_name}")
        except Exception as e:
            logger.error(f"Truncate table error: {e}")
            raise
