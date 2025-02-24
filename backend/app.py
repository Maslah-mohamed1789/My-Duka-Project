from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from auth import auth_routes
from models import db  # Import db from models.py

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions with the app
db.init_app(app)  # Initialize db properly
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_routes, url_prefix="/auth")

# Ensure tables are created
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
