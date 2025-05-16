# backend_funglusapp/app/core/config.py
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    APP_NAME: str = "FunglusApp Backend (Simplified V2)"
    # La base de datos se creará en la raíz de backend_funglusapp (donde ejecutas uvicorn)
    DATABASE_URL: str = "sqlite:///./funglusapp_db_simple.db" 

    class Config:
        env_file = ".env" # Si decides usar un archivo .env para configuraciones

settings = Settings()