import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Config:
    """Base configuration with default settings."""
    
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback_secret_key')  
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Ensure DATABASE_URL is correctly formatted
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///default.db')
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL

    # Security & Authentication
    BCRYPT_LOG_ROUNDS = int(os.environ.get('BCRYPT_LOG_ROUNDS', 12))  # For password hashing
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'fallback_jwt_secret')  # Needed for JWT-based auth

    # General settings
    DEBUG = False  # Default is False, overridden in subclasses

class DevelopmentConfig(Config):
    """Configuration for development environment."""
    
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL queries for debugging

class ProductionConfig(Config):
    """Configuration for production environment."""
    
    DEBUG = False
    SQLALCHEMY_ECHO = False  # Disable SQL logging in production

class TestingConfig(Config):
    """Configuration for testing environment."""
    
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"  # Use in-memory database for tests
    BCRYPT_LOG_ROUNDS = 4  # Reduce hashing rounds to speed up tests

# Set default config
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
