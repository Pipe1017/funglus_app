from pydantic import BaseModel, EmailStr
from typing import Optional

# Schema para el Token JWT
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_name: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Schema para crear usuarios (Input)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "operator"

# Schema para leer usuarios (Output - sin password)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True