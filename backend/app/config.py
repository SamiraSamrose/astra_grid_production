
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Astra-Grid"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    WORKERS: int = 4

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://astra-grid.cloud"
    ]

    DATABASE_URL: str = "postgresql://user:password@localhost/astraGrid"
    BIGQUERY_PROJECT: str = "astra-grid-project"
    BIGQUERY_DATASET: str = "infrastructure_data"

    BAIDU_API_KEY: str = ""
    BAIDU_SECRET_KEY: str = ""
    NOVITA_API_KEY: str = ""

    MODEL_PATH: str = "./models/weights"
    UNSLOTH_MODEL: str = "astra-grid-ernie-4.5-lora"
    LLAMAFACTORY_MODEL: str = "astra-grid-ernie-sft"
    PADDLEOCR_MODEL: str = "paddleocr-vl-fine-tuned"

    JWT_SECRET: str = "your-secret-key-change-this"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
