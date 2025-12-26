# backend/app/core/security.py
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# --- Configuración ---
# ¡IMPORTANTE! Usa una clave segura y mantenla en variables de entorno en producción
SECRET_KEY = "TU_SECRET_KEY_SUPER_SECRETA_CAMBIALA" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12 # 12 horas

# Configuración de Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- ESTA ES LA FUNCIÓN QUE CAUSABA EL ERROR ---
def create_access_token(
    subject: Union[str, Any], 
    role: str, 
    name: str, 
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Creamos el payload (contenido del token)
    to_encode = {
        "sub": str(subject), # 'sub' es el estándar JWT para el ID del usuario
        "role": role,        # Guardamos el rol para usarlo en el frontend
        "name": name,        # Guardamos el nombre para mostrarlo
        "exp": expire        # Fecha de expiración
    }
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt