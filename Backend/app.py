from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db
from auth import auth_bp
from routes import routes_bp

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///myduka.db"  # Update if using another DB
app.config["JWT_SECRET_KEY"] = "supersecretkey"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api")  # Change prefix if needed
app.register_blueprint(routes_bp, url_prefix="/api")

# Create DB tables (if not migrated)
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
