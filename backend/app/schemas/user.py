# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime


class Token(BaseModel):
    """Schema para respuesta de token de autenticación."""
    access_token: str
    token_type: str
    role: str
    user_name: str
    allowed_modules: List[str] = []


class TokenData(BaseModel):
    """Schema para datos extraídos del token."""
    email: Optional[str] = None
    role: Optional[str] = None


class UserCreate(BaseModel):
    """Schema para creación de usuarios."""
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "operator"
    is_active: bool = True
    allowed_modules: List[str] = ["laboratorio"]
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """
        Valida que la contraseña cumpla con requisitos mínimos de seguridad.
        
        Requisitos:
        - Mínimo 8 caracteres
        - Al menos una letra mayúscula
        - Al menos un número
        """
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        
        if not any(char.isupper() for char in v):
            raise ValueError('La contraseña debe contener al menos una letra mayúscula')
        
        if not any(char.isdigit() for char in v):
            raise ValueError('La contraseña debe contener al menos un número')
        
        return v
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v: str) -> str:
        """Valida que el rol sea uno de los permitidos."""
        valid_roles = ['admin', 'operator', 'viewer']
        if v not in valid_roles:
            raise ValueError(f'El rol debe ser uno de: {", ".join(valid_roles)}')
        return v


class UserUpdate(BaseModel):
    """Schema para actualización de usuarios."""
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    allowed_modules: Optional[List[str]] = None
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: Optional[str]) -> Optional[str]:
        """Valida contraseña solo si se proporciona."""
        if v is None:
            return v
        
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        
        if not any(char.isupper() for char in v):
            raise ValueError('La contraseña debe contener al menos una letra mayúscula')
        
        if not any(char.isdigit() for char in v):
            raise ValueError('La contraseña debe contener al menos un número')
        
        return v


class UserResponse(BaseModel):
    """Schema para respuesta de información de usuario."""
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool
    allowed_modules: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Msg(BaseModel):
    """Schema para mensajes simples."""
    message: str