# backend_funglusapp/app/core/config.py
import os
import sys

from pydantic_settings import BaseSettings


def get_base_path():
    # Si está empaquetado por PyInstaller y es un solo archivo o directorio
    if getattr(sys, "frozen", False):
        # sys.executable es la ruta al .exe
        # os.path.dirname(sys.executable) es el directorio donde está el .exe
        return os.path.dirname(sys.executable)
    # Si se ejecuta como script normal
    return os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )  # Sube un nivel desde core


BASE_DIR = get_base_path()
# Asume que la BD estará en un subdirectorio 'db_data' al lado del ejecutable del backend
# o en la raíz del bundle de PyInstaller si se copia allí.
# Ejemplo: Si copias la BD a la raíz del bundle (junto a tu .exe de backend):
DATABASE_FILE_NAME = "funglusapp_db_simple.db"
DATABASE_URL_FOR_PYINSTALLER = f"sqlite:///{os.path.join(BASE_DIR, DATABASE_FILE_NAME)}"


class Settings(BaseSettings):
    APP_NAME: str = "FunglusApp Backend"
    # Usa la URL para PyInstaller si está empaquetado
    DATABASE_URL: str = (
        DATABASE_URL_FOR_PYINSTALLER
        if getattr(sys, "frozen", False)
        else "sqlite:///./funglusapp_db_simple.db"
    )


settings = Settings()
