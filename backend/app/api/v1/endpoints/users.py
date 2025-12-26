from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import database, models
from app.core import security
from app.schemas import user as user_schema

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependencia para verificar si el usuario es admin
def get_current_admin_user(
    db: Session = Depends(get_db),
    # Aquí deberías implementar la lógica para obtener el usuario actual del token
    # Por ahora, lo simplificamos
) -> models.User:
    # TODO: Implementar verificación real del token
    # Esta es una versión simplificada
    pass

@router.get("/", response_model=List[user_schema.UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Lista todos los usuarios (solo para admins)
    """
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=user_schema.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: user_schema.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Crear nuevo usuario
    """
    # Verificar si el email ya existe
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Crear usuario
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

@router.get("/{user_id}", response_model=user_schema.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener usuario por ID
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=user_schema.UserResponse)
def update_user(
    user_id: int,
    user_update: user_schema.UserUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar usuario
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Si se actualiza la contraseña, hashearla
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = security.get_password_hash(update_data["password"])
        del update_data["password"]
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", response_model=user_schema.Msg)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Desactivar usuario (no se borra físicamente)
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db_user.is_active = False
    db.commit()
    
    return {"message": f"Usuario {db_user.email} desactivado exitosamente"}