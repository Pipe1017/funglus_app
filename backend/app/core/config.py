import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "FunglusApp Backend"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://funglusapp:funglusapp123@db:5432/funglusapp"
    )
    
    # CORS - Permitir acceso desde cualquier IP de la red local
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost",
        "http://localhost:8080",
        "http://192.168.1.19",
        "http://192.168.1.19:80",
        "http://192.168.1.19:8000",
        # Permitir toda la subred local
        "*"  # En desarrollo/red local está bien, en producción especificar IPs exactas
    ]
    
    class Config:
        case_sensitive = True

settings = Settings()
