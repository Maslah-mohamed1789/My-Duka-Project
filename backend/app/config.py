import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # Flask-Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'  
    MAIL_PORT = 587  
    MAIL_USE_TLS = True  
    MAIL_USE_SSL = False  
    MAIL_USERNAME=sheenamugo04@gmail.com
    MAIL_PASSWORD=krcoclzzzzjbnmqh  # Use your generated App Password (no spaces)
    MAIL_DEFAULT_SENDER=sheenamugo04@gmail.com

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
