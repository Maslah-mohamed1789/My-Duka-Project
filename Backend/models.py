from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
bcrypt = Bcrypt()

# ======================== USER MODEL =========================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="clerk")

    def check_password(self, password):
        return check_password_hash(self.password, password)


# ======================== STORE MODEL =========================
class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ======================== PRODUCT MODEL =========================
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    buying_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    store_id = db.Column(db.Integer, db.ForeignKey("store.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    store = db.relationship("Store", backref=db.backref("products", lazy=True))

# ======================== SUPPLY REQUEST MODEL =========================
class SupplyRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    requested_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pending")  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship("Product", backref=db.backref("supply_requests", lazy=True))
    user = db.relationship("User", backref=db.backref("supply_requests", lazy=True))

# ======================== TRANSACTION MODEL =========================
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    clerk_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)  # sale, restock
    quantity = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), nullable=False, default="unpaid")  # paid, unpaid
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship("Product", backref=db.backref("transactions", lazy=True))
    clerk = db.relationship("User", backref=db.backref("transactions", lazy=True))
