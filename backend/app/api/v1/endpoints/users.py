# backend/app/api/v1/endpoints/users.py
"""
Endpoints de gestión de usuarios.
Solo accesibles para usuarios con rol 'admin'.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import database, models
from app.core import security
from app.schemas import user as user_schema
from app.core.dependencies import get_current_admin_user, get_current_user

router = APIRouter()


def get_db():
    """Dependencia para obtener sesión de base de datos."""
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[user_schema.UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Lista todos los usuarios del sistema.
    
    **Requiere rol de administrador.**
    
    - **skip**: Número de registros a saltar (paginación)
    - **limit**: Máximo número de registros a retornar
    """
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


@router.post("/", response_model=user_schema.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: user_schema.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Crea un nuevo usuario.
    
    **Requiere rol de administrador.**
    
    Validaciones:
    - Email único
    - Contraseña segura (mínimo 8 caracteres)
    - Rol válido (admin, operator, viewer)
    """
    # Verificar si el email ya existe
    existing_user = db.query(models.User).filter(
        models.User.email == user_in.email
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El email '{user_in.email}' ya está registrado"
        )
    
    # Validar rol
    valid_roles = ["admin", "operator", "viewer"]
    if user_in.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Rol inválido. Debe ser uno de: {', '.join(valid_roles)}"
        )
    
    # Crear usuario con contraseña hasheada
    hashed_password = security.get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=user_in.is_active,
        allowed_modules=user_in.allowed_modules
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.get("/me", response_model=user_schema.UserResponse)
def read_current_user(
    current_user: models.User = Depends(get_current_user)
):
    """
    Obtiene información del usuario actualmente autenticado.
    
    **No requiere ser admin** - cualquier usuario autenticado puede ver sus propios datos.
    """
    return current_user


@router.get("/{user_id}", response_model=user_schema.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Obtiene un usuario por su ID.
    
    **Requiere rol de administrador.**
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    
    return user


@router.put("/{user_id}", response_model=user_schema.UserResponse)
def update_user(
    user_id: int,
    user_update: user_schema.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Actualiza un usuario existente.
    
    **Requiere rol de administrador.**
    
    Notas:
    - Si se actualiza la contraseña, será hasheada automáticamente
    - No se puede cambiar el propio rol de admin a otro rol (protección)
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    
    # Protección: evitar que un admin se quite sus propios permisos
    if db_user.id == current_user.id and user_update.role and user_update.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes cambiar tu propio rol de administrador"
        )
    
    # Actualizar campos
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Si se actualiza la contraseña, hashearla
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = security.get_password_hash(update_data["password"])
        del update_data["password"]
    
    # Validar rol si se está actualizando
    if "role" in update_data:
        valid_roles = ["admin", "operator", "viewer"]
        if update_data["role"] not in valid_roles:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Rol inválido. Debe ser uno de: {', '.join(valid_roles)}"
            )
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.delete("/{user_id}", response_model=user_schema.Msg)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Desactiva un usuario (no se borra físicamente).
    
    **Requiere rol de administrador.**
    
    Nota: Los usuarios no se borran permanentemente, solo se marcan como inactivos.
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    
    # Protección: evitar que un admin se desactive a sí mismo
    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivarte a ti mismo"
        )
    
    db_user.is_active = False
    db.commit()
    
    return {"message": f"Usuario '{db_user.email}' desactivado exitosamente"}