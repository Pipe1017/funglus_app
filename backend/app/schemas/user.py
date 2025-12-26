from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Schema para el Token JWT (ya existe)
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_name: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Schema para crear usuarios
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "operator"
    is_active: bool = True
    allowed_modules: List[str] = ["laboratorio"]  # Nuevo campo

# Schema para actualizar usuarios
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    allowed_modules: Optional[List[str]] = None

# Schema para leer usuarios (sin password)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool
    allowed_modules: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Schema para mensajes
class Msg(BaseModel):
    message: str