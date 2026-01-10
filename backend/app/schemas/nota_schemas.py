# backend/app/schemas/nota_schemas.py
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


class NotaInformeCreate(BaseModel):
    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int
    secuencia_id: Optional[int] = None
    nota: str
    
    @field_validator('nota')
    @classmethod
    def validate_nota(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('La nota no puede estar vacía')
        if len(v) > 1000:
            raise ValueError('La nota es demasiado larga (máximo 1000 caracteres)')
        return v.strip()


class NotaInformeUpdate(BaseModel):
    """Schema para actualizar una nota existente"""
    nota: str


class NotaInformeResponse(BaseModel):
    """Schema para respuesta de nota"""
    id: int
    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int
    secuencia_id: Optional[int] = None
    nota: str
    usuario_email: str
    usuario_nombre: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Nombres de catálogos (opcional, para mostrar en frontend)
    ciclo_nombre: Optional[str] = None
    etapa_nombre: Optional[str] = None
    muestra_nombre: Optional[str] = None
    origen_nombre: Optional[str] = None
    
    class Config:
        from_attributes = True