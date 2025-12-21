import time
import psycopg2
import os

def wait_for_db():
    """Espera a que PostgreSQL esté disponible"""
    db_url = os.getenv("DATABASE_URL", "postgresql://funglusapp:funglusapp123@db:5432/funglusapp")
    
    # Parsear URL
    parts = db_url.replace("postgresql://", "").split("@")
    user_pass = parts[0].split(":")
    host_db = parts[1].split("/")
    host_port = host_db[0].split(":")
    
    max_retries = 30
    retry = 0
    
    while retry < max_retries:
        try:
            conn = psycopg2.connect(
                dbname=host_db[1],
                user=user_pass[0],
                password=user_pass[1],
                host=host_port[0],
                port=host_port[1] if len(host_port) > 1 else "5432"
            )
            conn.close()
            print("✅ Database is ready!")
            return
        except psycopg2.OperationalError:
            retry += 1
            print(f"⏳ Waiting for database... ({retry}/{max_retries})")
            time.sleep(2)
    
    raise Exception("❌ Database not available after 30 retries")

if __name__ == "__main__":
    wait_for_db()