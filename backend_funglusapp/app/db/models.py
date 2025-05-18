# backend_funglusapp/app/db/models.py
from sqlalchemy import Column, Float, Integer, String, UniqueConstraint

from .database import Base


class MateriaPrima(Base):
    __tablename__ = "lab_materia_prima"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, index=True, nullable=False)
    origen = Column(String, index=True, nullable=False)  # Clave
    muestra = Column(String, index=True, nullable=False)  # Clave

    fecha_i = Column(String, nullable=True)
    fecha_p = Column(String, nullable=True)
    p1h1 = Column(Float, nullable=True)
    p2h2 = Column(Float, nullable=True)
    porc_h1 = Column(Float, nullable=True)
    porc_h2 = Column(Float, nullable=True)
    p_ph = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    d1 = Column(Float, nullable=True)
    d2 = Column(Float, nullable=True)
    d3 = Column(Float, nullable=True)
    hprom = Column(Float, nullable=True)
    dprom = Column(Float, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "ciclo", "origen", "muestra", name="_mp_ciclo_origen_muestra_uc"
        ),
    )


class Gubys(Base):
    __tablename__ = "lab_gubys"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, index=True, nullable=False)  # Clave
    origen = Column(String, index=True, nullable=False)  # Clave
    # Muestra ya no es clave para Gubys, si lo necesitas como campo de datos, añádelo:
    # muestra = Column(String, nullable=True)

    fecha_i = Column(String, nullable=True)
    fecha_p = Column(String, nullable=True)
    p1h1 = Column(Float, nullable=True)
    p2h2 = Column(Float, nullable=True)
    porc_h1 = Column(Float, nullable=True)
    porc_h2 = Column(Float, nullable=True)
    p_ph = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    hprom = Column(Float, nullable=True)  # Calculado

    __table_args__ = (
        UniqueConstraint("ciclo", "origen", name="_gubys_ciclo_origen_uc"),
    )  # CAMBIO AQUÍ


class TamoHumedo(Base):
    __tablename__ = "lab_tamo_humedo"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, index=True, nullable=False)  # Clave
    origen = Column(String, index=True, nullable=False)  # Clave
    # Muestra ya no es clave para TamoHumedo, si lo necesitas como campo de datos, añádelo:
    # muestra = Column(String, nullable=True)

    fecha_i = Column(String, nullable=True)
    fecha_p = Column(String, nullable=True)
    p1h1 = Column(Float, nullable=True)
    p2h2 = Column(Float, nullable=True)
    porc_h1 = Column(Float, nullable=True)
    porc_h2 = Column(Float, nullable=True)
    p_ph = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    d1 = Column(Float, nullable=True)
    d2 = Column(Float, nullable=True)
    d3 = Column(Float, nullable=True)
    hprom = Column(Float, nullable=True)
    dprom = Column(Float, nullable=True)

    __table_args__ = (
        UniqueConstraint("ciclo", "origen", name="_tamo_humedo_ciclo_origen_uc"),
    )  # CAMBIO AQUÍ


# La clase Formulacion ha sido eliminada.
