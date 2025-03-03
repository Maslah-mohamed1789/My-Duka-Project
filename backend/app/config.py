import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://myduka_user:sheenaMUGO2004@localhost/myduka')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # Flask-Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'  
    MAIL_PORT = 587  
    MAIL_USE_TLS = True  
    MAIL_USE_SSL = False  
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')  
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')  
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
