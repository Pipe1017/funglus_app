# backend/app/core/dependencies.py
"""
Dependencias de autenticación y autorización para FastAPI.
Centraliza la lógica de validación de tokens y permisos de usuario.
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.db import database, models
from app.core import security

# Configuración del esquema OAuth2
# El tokenUrl debe coincidir con tu endpoint de login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/access-token")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(database.get_db)
) -> models.User:
    """
    Dependencia que valida el token JWT y retorna el usuario actual.
    
    Args:
        token: Token JWT extraído del header Authorization
        db: Sesión de base de datos
        
    Returns:
        models.User: Usuario autenticado
        
    Raises:
        HTTPException 401: Si el token es inválido o el usuario no existe
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificar el token JWT
        payload = jwt.decode(
            token, 
            security.SECRET_KEY, 
            algorithms=[security.ALGORITHM]
        )
        
        # Extraer el email del payload (campo 'sub' - subject)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
            
    except JWTError as e:
        # Si hay cualquier error al decodificar (token expirado, firma inválida, etc.)
        print(f"Error JWT: {e}")
        raise credentials_exception
    
    # Buscar el usuario en la base de datos
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    
    return user


def get_current_admin_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    """
    Dependencia que valida que el usuario actual sea un administrador.
    
    Args:
        current_user: Usuario autenticado (inyectado por get_current_user)
        
    Returns:
        models.User: Usuario administrador
        
    Raises:
        HTTPException 403: Si el usuario no es admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador para realizar esta acción"
        )
    return current_user


def check_module_permission(module: str):
    """
    Función factory que retorna una dependencia para validar acceso a módulos.
    
    Args:
        module: Nombre del módulo a validar (ej: "laboratorio", "admin")
        
    Returns:
        Callable: Dependencia que valida el permiso del módulo
        
    Ejemplo de uso:
        @router.get("/catalogos/ciclos/")
        def get_ciclos(
            current_user: models.User = Depends(check_module_permission("laboratorio"))
        ):
            ...
    """
    def _check_permission(
        current_user: models.User = Depends(get_current_user)
    ) -> models.User:
        # Los admins tienen acceso a todos los módulos
        if current_user.role == "admin":
            return current_user
        
        # Validar que el usuario tenga el módulo en su lista de permisos
        if module not in (current_user.allowed_modules or []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tienes acceso al módulo '{module}'"
            )
        
        return current_user
    
    return _check_permission


# Dependencia opcional: permite endpoints que funcionen con o sin autenticación
def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(database.get_db)
) -> Optional[models.User]:
    """
    Similar a get_current_user pero retorna None si no hay token
    en lugar de lanzar excepción.
    
    Útil para endpoints públicos que muestran contenido diferente
    si el usuario está autenticado.
    """
    if not token:
        return None
    
    try:
        return get_current_user(token=token, db=db)
    except HTTPException:
        return None