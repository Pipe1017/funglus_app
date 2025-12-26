# backend/app/core/config.py
"""
Configuración central de la aplicación.
Utiliza variables de entorno para configuración sensible.
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración de la aplicación con valores por defecto."""
    
    # Información de la aplicación
    APP_NAME: str = "FunglusApp Backend"
    VERSION: str = "1.0.0"
    
    # Seguridad - JWT
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", 
        "CHANGE-THIS-SECRET-KEY-IN-PRODUCTION-USE-RANDOM-STRING"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 720  # 12 horas
    
    # Base de datos
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://funglusapp:funglusapp123@db:5432/funglusapp"
    )
    
    # CORS - Configuración de orígenes permitidos
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",      # Vite dev server
        "http://localhost:3000",      # React dev server alternativo
        "http://localhost",           # Producción local
        "http://localhost:80",        # Producción local con puerto explícito
        "http://192.168.1.19",        # IP de red local (ajustar según tu red)
        "http://192.168.1.19:80",     # Con puerto explícito
    ]
    
    # Entorno
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    class Config:
        case_sensitive = True
        env_file = ".env"  # Permite cargar desde archivo .env


# Instancia global de configuración
settings = Settings()


# Validación al iniciar
if settings.ENVIRONMENT == "production":
    if "CHANGE-THIS" in settings.SECRET_KEY:
        raise ValueError(
            "⚠️  ADVERTENCIA DE SEGURIDAD: "
            "Debes configurar SECRET_KEY con un valor seguro en producción. "
            "Genera uno con: openssl rand -hex 32"
        )