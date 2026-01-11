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
        "postgresql://funglusapp:funglusapp123@db:5432/funglusapp_db"
    )
    
    # ═══════════════════════════════════════════════════════════
    # 🌐 CORS - AHORA CON VARIABLE DE ENTORNO
    # ═══════════════════════════════════════════════════════════
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        """
        Lee CORS origins desde variable de entorno.
        Si no existe, usa valores por defecto.
        
        Variable de entorno esperada:
        BACKEND_CORS_ORIGINS=https://funglus.bunnatek.com,http://localhost:5173,...
        """
        origins_env = os.getenv("BACKEND_CORS_ORIGINS")
        
        if origins_env:
            # Parsear desde variable de entorno (separado por comas)
            origins = [origin.strip() for origin in origins_env.split(",")]
            # Filtrar valores vacíos
            origins = [origin for origin in origins if origin]
            return origins
        
        # Valores por defecto si no hay variable de entorno
        # Valores por defecto si no hay variable de entorno
        return [
            # 🔥 Producción (Cloudflare Tunnel)
            "https://funglus.bunnatek.com",
            "https://funglus-api.bunnatek.com",
            
            # 🧪 Desarrollo local
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost",
            "http://localhost:80",
            
            # 🏠 Red local - Acepta cualquier IP 192.168.1.x
            "http://192.168.1.4",
            "http://192.168.1.4:80",
        ]
    
    # Entorno
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    class Config:
        case_sensitive = True
        env_file = ".env"  # Permite cargar desde archivo .env


# Instancia global de configuración
settings = Settings()


# ═══════════════════════════════════════════════════════════
# 🛠️  LOG DE CONFIGURACIÓN (Solo en desarrollo)
# ═══════════════════════════════════════════════════════════
if settings.ENVIRONMENT == "development":
    print("\n" + "="*70)
    print("🔧 BACKEND CONFIGURATION")
    print("="*70)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Debug: {settings.DEBUG}")
    print(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'Not configured'}")
    print(f"CORS Origins ({len(settings.BACKEND_CORS_ORIGINS)} configured):")
    for origin in settings.BACKEND_CORS_ORIGINS:
        print(f"  ✓ {origin}")
    print("="*70 + "\n")


# ═══════════════════════════════════════════════════════════
# 🔒 VALIDACIÓN DE SEGURIDAD
# ═══════════════════════════════════════════════════════════
if settings.ENVIRONMENT == "production":
    if "CHANGE-THIS" in settings.SECRET_KEY:
        raise ValueError(
            "⚠️  ADVERTENCIA DE SEGURIDAD: "
            "Debes configurar SECRET_KEY con un valor seguro en producción. "
            "Genera uno con: openssl rand -hex 32"
        )