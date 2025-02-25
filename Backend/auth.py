from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
auth_bp = Blueprint("auth", __name__)

# ======================= REGISTER ROUTE =======================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not all(key in data for key in ["username", "email", "password"]):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if email already exists
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 409

    # Create new user
    new_user = User(
        username=data["username"],
        email=data["email"],
        password=generate_password_hash(data["password"]),
        role=data.get("role", "clerk")  # Default role is 'clerk'
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "role": new_user.role}), 201



# ======================= LOGIN ROUTE =======================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Check user role and return respective response
    if user.role == "admin":
        access_token = create_access_token(identity={"id": user.id, "role": "admin"})
        return jsonify({"message": "Admin login successful", "access_token": access_token, "role": "admin"}), 200
    elif user.role == "merchant":
        access_token = create_access_token(identity={"id": user.id, "role": "merchant"})
        return jsonify({"message": "Merchant login successful", "access_token": access_token, "role": "merchant"}), 200
    elif user.role == "clerk":
        access_token = create_access_token(identity={"id": user.id, "role": "clerk"})
        return jsonify({"message": "Clerk login successful", "access_token": access_token, "role": "clerk"}), 200
    else:
        return jsonify({"error": "Unauthorized role"}), 403
