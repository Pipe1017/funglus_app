# backend/app/core/security.py
"""
Utilidades de seguridad para autenticación y manejo de contraseñas.
"""

from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Configuración de algoritmo de hashing (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Importar configuración desde settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica que una contraseña en texto plano coincida con su hash.
    
    Args:
        plain_password: Contraseña ingresada por el usuario
        hashed_password: Hash almacenado en la base de datos
        
    Returns:
        bool: True si la contraseña es correcta
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Genera un hash bcrypt de una contraseña.
    
    Args:
        password: Contraseña en texto plano
        
    Returns:
        str: Hash de la contraseña
    """
    return pwd_context.hash(password)


def create_access_token(
    subject: Union[str, Any], 
    role: str, 
    name: str, 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Crea un token JWT para autenticación.
    
    Args:
        subject: Identificador del usuario (email)
        role: Rol del usuario (admin, operator, viewer)
        name: Nombre completo del usuario
        expires_delta: Tiempo de expiración personalizado
        
    Returns:
        str: Token JWT codificado
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Payload del token
    to_encode = {
        "sub": str(subject),  # Subject: identificador del usuario (email)
        "role": role,          # Rol para autorización
        "name": name,          # Nombre para mostrar en UI
        "exp": expire          # Tiempo de expiración
    }
    
    # Codificar y retornar el token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt