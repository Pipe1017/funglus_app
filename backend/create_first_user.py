# backend/create_first_user.py
from sqlalchemy.orm import Session
from app.db import database, models
from app.core.security import get_password_hash

def create_admin_user():
    db = database.SessionLocal()
    try:
        EMAIL_A_CREAR = "felip_1017@outlook.com"
        
        # 1. Verificar si ya existe (Usando el MISMO email)
        user = db.query(models.User).filter(models.User.email == EMAIL_A_CREAR).first()
        if user:
            print(f"INFO: El usuario {EMAIL_A_CREAR} ya existe. No se requiere acción.")
            return

        # 2. Crear nuevo usuario si no existe
        admin_user = models.User(
            email=EMAIL_A_CREAR,
            hashed_password=get_password_hash("admin123"), # <--- CONTRASEÑA
            full_name="Administrador del Sistema",
            role="admin",
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("✅ Usuario Admin creado exitosamente:")
        print(f"Email: {admin_user.email}")
        print(f"Role: {admin_user.role}")
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Asegurarse que las tablas existan antes de insertar
    models.Base.metadata.create_all(bind=database.engine)
    create_admin_user()