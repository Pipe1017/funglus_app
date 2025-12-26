# backend/create_first_user.py
"""
Script para crear el primer usuario administrador del sistema.
Se ejecuta automáticamente al iniciar el contenedor Docker.
"""

import sys
from app.db.database import SessionLocal
from app.db import models
from app.core import security


def create_first_admin():
    """
    Crea un usuario administrador por defecto si no existe ninguno.
    
    Credenciales por defecto:
    - Email: admin@funglus.com
    - Password: Admin123!
    - Rol: admin
    """
    db = SessionLocal()
    
    try:
        # Verificar si ya existe algún usuario admin
        existing_admin = db.query(models.User).filter(
            models.User.role == "admin"
        ).first()
        
        if existing_admin:
            print("✅ Ya existe un usuario administrador en el sistema")
            print(f"   Email: {existing_admin.email}")
            return
        
        # Crear usuario administrador por defecto
        admin_user = models.User(
            email="admin@funglus.com",
            hashed_password=security.get_password_hash("Admin123!"),
            full_name="Administrador del Sistema",
            role="admin",
            is_active=True,
            allowed_modules=["laboratorio", "siembra", "incubacion", "admin"]
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("=" * 60)
        print("✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE")
        print("=" * 60)
        print(f"   Email:    admin@funglus.com")
        print(f"   Password: Admin123!")
        print(f"   Rol:      admin")
        print("=" * 60)
        print("⚠️  IMPORTANTE: Cambia la contraseña después del primer login")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error al crear usuario administrador: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    create_first_admin()