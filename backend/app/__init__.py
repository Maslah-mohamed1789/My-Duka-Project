from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
import os
from app.config import config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)

    # Load configuration based on environment
    env_config = os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[env_config])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.inventory_routes import inventory_bp
    from app.routes.supply_routes import supply_bp
    from app.routes.payment_routes import payment_bp
    from app.routes.report_routes import report_bp
    from app.routes.sales_routes import sales_bp
    from app.routes.store_routes import store_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(inventory_bp, url_prefix='/inventory')
    app.register_blueprint(supply_bp, url_prefix='/supply_request')
    app.register_blueprint(payment_bp, url_prefix='/payment')
    app.register_blueprint(report_bp, url_prefix='/report')
    app.register_blueprint(sales_bp, url_prefix='/sales')
    app.register_blueprint(store_bp, url_prefix='/store') 

    return app
    

