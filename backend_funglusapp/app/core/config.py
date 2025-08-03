import os
import sys
import shutil
from pydantic_settings import BaseSettings

DATABASE_FILE_NAME = "funglusapp_db_simple.db"

def get_database_path():
    if getattr(sys, "frozen", False):
        if len(sys.argv) > 1:
            app_data_path = sys.argv[1]
            working_db_path = os.path.join(app_data_path, DATABASE_FILE_NAME)

            if not os.path.exists(working_db_path):
                bundle_dir = os.path.dirname(sys.executable)
                bundle_db_path = os.path.join(bundle_dir, DATABASE_FILE_NAME)
                
                if os.path.exists(bundle_db_path):
                    os.makedirs(app_data_path, exist_ok=True)
                    shutil.copy2(bundle_db_path, working_db_path)

            return f"sqlite:///{working_db_path}"
        
        return f"sqlite:///{os.path.join(os.path.dirname(sys.executable), DATABASE_FILE_NAME)}"

    return f"sqlite:///./{DATABASE_FILE_NAME}"

class Settings(BaseSettings):
    APP_NAME: str = "FunglusApp Backend"
    DATABASE_URL: str = get_database_path()

settings = Settings()