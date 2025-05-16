# backend_funglusapp/app/db/models.py
from sqlalchemy import Column, Integer, String, Float
from .database import Base # Importación relativa

# --- LABORATORIO ---
class MateriaPrima(Base): # NUEVA TABLA
    __tablename__ = "lab_materia_prima"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, unique=True, index=True, nullable=False)
    fecha_i = Column(String, nullable=True)
    fecha_p = Column(String, nullable=True)
    muestra = Column(String, nullable=True) # Campo Muestra
    origen = Column(String, nullable=True)
    p1h1 = Column(Float, nullable=True)
    p2h2 = Column(Float, nullable=True)
    porc_h1 = Column(Float, nullable=True) # %H1
    porc_h2 = Column(Float, nullable=True) # %H2
    p_ph = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    d1 = Column(Float, nullable=True)
    d2 = Column(Float, nullable=True)
    d3 = Column(Float, nullable=True)
    hprom = Column(Float, nullable=True) # Calculado: (%H1 + %H2) / 2
    dprom = Column(Float, nullable=True) # Calculado: (d1 + d2 + d3) / 3

class Gubys(Base):
    __tablename__ = "lab_gubys"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, unique=True, index=True, nullable=False)
    fecha_i = Column(String, nullable=True)
    fecha_p = Column(String, nullable=True)
    origen = Column(String, nullable=True)
    p1h1 = Column(Float, nullable=True)
    p2h2 = Column(Float, nullable=True)
    porc_h1 = Column(Float, nullable=True)
    porc_h2 = Column(Float, nullable=True)
    p_ph = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    hprom = Column(Float, nullable=True) # Calculado

class Cenizas(Base):
    __tablename__ = "lab_cenizas"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, unique=True, index=True, nullable=False)
    fecha_i = Column(String, nullable=True)
    muestra = Column(String, nullable=True)
    origen = Column(String, nullable=True)
    p1 = Column(Float, nullable=True)
    p2 = Column(Float, nullable=True)
    p3 = Column(Float, nullable=True)
    porc_cz = Column(Float, nullable=True)

class Formulacion(Base):
    __tablename__ = "formulacion"
    key = Column(Integer, primary_key=True, index=True)
    ciclo = Column(String, unique=True, index=True, nullable=False)
    peso = Column(Float, nullable=True)
    muestra = Column(String, nullable=True)
    origen = Column(String, nullable=True)
    porc_n_entrada = Column(Float, nullable=True)
    porc_cz_entrada = Column(Float, nullable=True)
    hprom_entrada = Column(Float, nullable=True)
    ms_kg = Column(Float, nullable=True)
    n_kg = Column(Float, nullable=True)
    porc_n_ms = Column(Float, nullable=True)
    cz_kg = Column(Float, nullable=True)
    porc_cz_ms = Column(Float, nullable=True)
    c_kg = Column(Float, nullable=True)
    c_n_ratio = Column(Float, nullable=True)
    mos_kg = Column(Float, nullable=True)
    porc_n_mos = Column(Float, nullable=True)
    porc_cz_mos = Column(Float, nullable=True)

# Aquí irían los modelos para ARMADA, VOLTEO, etc. cuando los añadas.
# Recuerda añadirles 'unique=True' a su campo 'ciclo' también.
