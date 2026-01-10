# backend/app/routers/notas_informe_router.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import NotaInforme
from app.schemas.nota_schemas import NotaInformeCreate, NotaInformeUpdate, NotaInformeResponse
from app.core.dependencies import get_current_user
from app.db.models import User

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[NotaInformeResponse])
def get_notas(
    ciclo_id: Optional[int] = None,
    etapa_id: Optional[int] = None,
    muestra_id: Optional[int] = None,
    origen_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtener notas con filtros opcionales.
    Si no se pasan filtros, devuelve todas las notas.
    """
    query = db.query(NotaInforme)
    
    if ciclo_id:
        query = query.filter(NotaInforme.ciclo_id == ciclo_id)
    if etapa_id:
        query = query.filter(NotaInforme.etapa_id == etapa_id)
    if muestra_id:
        query = query.filter(NotaInforme.muestra_id == muestra_id)
    if origen_id:
        query = query.filter(NotaInforme.origen_id == origen_id)
    
    notas = query.order_by(NotaInforme.created_at.desc()).all()
    
    # Agregar nombres de catálogos
    for nota in notas:
        nota.ciclo_nombre = nota.ciclo_ref.nombre_ciclo if nota.ciclo_ref else None
        nota.etapa_nombre = nota.etapa_ref.nombre if nota.etapa_ref else None
        nota.muestra_nombre = nota.muestra_ref.nombre if nota.muestra_ref else None
        nota.origen_nombre = nota.origen_ref.nombre if nota.origen_ref else None
    
    return notas


@router.post("/", response_model=NotaInformeResponse, status_code=status.HTTP_201_CREATED)
def create_nota(
    nota_data: NotaInformeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Crear una nueva nota.
    Cualquier usuario autenticado puede crear notas.
    """
    nueva_nota = NotaInforme(
        ciclo_id=nota_data.ciclo_id,
        etapa_id=nota_data.etapa_id,
        muestra_id=nota_data.muestra_id,
        origen_id=nota_data.origen_id,
        secuencia_id=nota_data.secuencia_id,
        nota=nota_data.nota,
        usuario_email=current_user.email,
        usuario_nombre=current_user.full_name or current_user.email
    )
    
    db.add(nueva_nota)
    db.commit()
    db.refresh(nueva_nota)
    
    # Agregar nombres de catálogos
    nueva_nota.ciclo_nombre = nueva_nota.ciclo_ref.nombre_ciclo if nueva_nota.ciclo_ref else None
    nueva_nota.etapa_nombre = nueva_nota.etapa_ref.nombre if nueva_nota.etapa_ref else None
    nueva_nota.muestra_nombre = nueva_nota.muestra_ref.nombre if nueva_nota.muestra_ref else None
    nueva_nota.origen_nombre = nueva_nota.origen_ref.nombre if nueva_nota.origen_ref else None
    
    return nueva_nota


@router.put("/{nota_id}", response_model=NotaInformeResponse)
def update_nota(
    nota_id: int,
    nota_data: NotaInformeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Actualizar una nota existente.
    Solo el usuario que creó la nota o un admin puede editarla.
    """
    nota = db.query(NotaInforme).filter(NotaInforme.id == nota_id).first()
    
    if not nota:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nota no encontrada"
        )
    
    # Verificar permisos
    if nota.usuario_email != current_user.email and current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para editar esta nota"
        )
    
    nota.nota = nota_data.nota
    db.commit()
    db.refresh(nota)
    
    # Agregar nombres de catálogos
    nota.ciclo_nombre = nota.ciclo_ref.nombre_ciclo if nota.ciclo_ref else None
    nota.etapa_nombre = nota.etapa_ref.nombre if nota.etapa_ref else None
    nota.muestra_nombre = nota.muestra_ref.nombre if nota.muestra_ref else None
    nota.origen_nombre = nota.origen_ref.nombre if nota.origen_ref else None
    
    return nota


@router.delete("/{nota_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nota(
    nota_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Eliminar una nota.
    Solo el usuario que creó la nota o un admin puede eliminarla.
    """
    nota = db.query(NotaInforme).filter(NotaInforme.id == nota_id).first()
    
    if not nota:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nota no encontrada"
        )
    
    # Verificar permisos
    if nota.usuario_email != current_user.email and current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para eliminar esta nota"
        )
    
    db.delete(nota)
    db.commit()
    
    return None