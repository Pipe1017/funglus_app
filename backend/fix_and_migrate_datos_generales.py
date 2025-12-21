#!/usr/bin/env python3
"""
Script para migrar datos_generales_laboratorio convirtiendo strings vacíos a NULL
"""
import sqlite3
import psycopg2
from psycopg2.extras import execute_values
import os

SQLITE_DB_PATH = "app/db/funglusapp_db_simple.db"
POSTGRES_CONNECTION = "postgresql://funglusapp:funglusapp123@localhost:5432/funglusapp"

def clean_row(row):
    """Convertir strings vacíos/espacios a None (NULL en PostgreSQL)"""
    cleaned = []
    for value in row:
        # Si es string, limpiarlo y convertir a None si está vacío
        if isinstance(value, str):
            cleaned_value = value.strip()
            if cleaned_value == '' or cleaned_value == "":
                cleaned.append(None)
            else:
                cleaned.append(value)
        else:
            cleaned.append(value)
    return tuple(cleaned)

print("🔧 Migrando datos_generales_laboratorio con limpieza de datos...")

# Conectar a SQLite
sqlite_conn = sqlite3.connect(SQLITE_DB_PATH)
sqlite_cursor = sqlite_conn.cursor()

# Conectar a PostgreSQL
pg_conn = psycopg2.connect(POSTGRES_CONNECTION)
pg_cursor = pg_conn.cursor()

# Obtener datos de SQLite
sqlite_cursor.execute("SELECT * FROM datos_generales_laboratorio")
rows = sqlite_cursor.fetchall()

print(f"📦 Registros encontrados: {len(rows)}")

# Limpiar filas (convertir "" y " " a None)
cleaned_rows = [clean_row(row) for row in rows]

# Verificar cuántos valores se limpiaron
total_cleaned = 0
for original, cleaned in zip(rows, cleaned_rows):
    for orig_val, clean_val in zip(original, cleaned):
        if orig_val != clean_val:
            total_cleaned += 1

print(f"🧹 Valores limpiados (convertidos a NULL): {total_cleaned}")

# Columnas
columns = ['id', 'ciclo_id', 'etapa_id', 'muestra_id', 'origen_id', 'secuencia_id',
           'fecha_ingreso', 'fecha_procesamiento', 'peso_h1_g', 'peso_h2_g',
           'humedad_1_porc', 'humedad_2_porc', 'humedad_prom_porc', 'peso_ph_g',
           'ph_valor', 'fdr_1_kgf', 'fdr_2_kgf', 'fdr_3_kgf', 'fdr_prom_kgf',
           'resultado_cenizas_porc', 'resultado_nitrogeno_total_porc',
           'resultado_nitrogeno_seca_porc', 'created_at', 'updated_at']

cols_str = ', '.join(columns)

# Primero, limpiar la tabla en PostgreSQL
print("��️  Limpiando tabla datos_generales_laboratorio en PostgreSQL...")
pg_cursor.execute("DELETE FROM datos_generales_laboratorio")
pg_conn.commit()

# Insertar datos limpios
print("📥 Insertando datos limpios...")
insert_query = f"INSERT INTO datos_generales_laboratorio ({cols_str}) VALUES %s"

try:
    execute_values(pg_cursor, insert_query, cleaned_rows, page_size=100)
    pg_conn.commit()
    
    # Verificar
    pg_cursor.execute("SELECT COUNT(*) FROM datos_generales_laboratorio")
    count = pg_cursor.fetchone()[0]
    
    print(f"✅ {count} registros migrados exitosamente!")
    
    # Resetear secuencia
    pg_cursor.execute("""
        SELECT setval('datos_generales_laboratorio_id_seq', 
            COALESCE((SELECT MAX(id) FROM datos_generales_laboratorio), 1), 
            true)
    """)
    pg_conn.commit()
    print("✅ Secuencia reseteada")
    
except Exception as e:
    print(f"❌ Error: {e}")
    pg_conn.rollback()

sqlite_conn.close()
pg_conn.close()

print("\n🎉 ¡Migración de datos_generales_laboratorio completada!")
