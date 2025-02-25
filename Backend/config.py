import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///database.db")  # ✅ FIXED: Now it reads from the .env file
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")  
