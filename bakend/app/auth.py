from flask import Blueprint, jsonify, request, current_app
from functools import wraps
import jwt
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message
from datetime import datetime, timedelta
from app import db, mail  # Import mail and db correctly

auth_blueprint = Blueprint('auth', __name__)

# Token authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])

            if not current_user:
                return jsonify({'message': 'User not found!'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_blueprint.route('/invite-admin', methods=['POST'])
@token_required
def invite_admin(current_user):
    if current_user.role != 'merchant':  # Only merchants can invite admins
        return jsonify({'message': 'Permission denied!'}), 403

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required!'}), 400

    # Generate an invite token (valid for 24 hours)
    token = jwt.encode(
        {'email': email, 'role': 'admin', 'exp': datetime.utcnow() + timedelta(hours=24)},
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )

    invite_link = f'http://localhost:5000/api/auth/register-admin/{token}'
    msg = Message('Admin Invitation', sender=current_app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'You have been invited as an Admin. Click this link to register: {invite_link}'

    try:
        mail.send(msg)
    except Exception as e:
        print("Email sending failed:", e)

    return jsonify({'message': 'Admin invitation sent!'}), 200

# Register an Admin via Invite
@auth_blueprint.route('/register-admin/<token>', methods=['POST'])
def register_admin(token):
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        email = data['email']
        role = data['role']

        if role != 'admin':
            return jsonify({'message': 'Invalid role in invite token!'}), 403

        request_data = request.get_json()

        if request_data['email'] != email:
            return jsonify({'message': 'Email does not match the invite!'}), 403

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'User already registered!'}), 400

        hashed_password = generate_password_hash(request_data['password'], method='pbkdf2:sha256')

        new_admin = User(
            username=request_data['username'],
            email=email,
            password_hash=hashed_password,
            role='admin',
            is_active=True
        )

        db.session.add(new_admin)
        db.session.commit()

        return jsonify({'message': 'Admin registered successfully!'}), 201

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Invite link expired!'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid invite token!'}), 400

# Admin adds a Clerk
@auth_blueprint.route('/register-clerk', methods=['POST'])
@token_required
def register_clerk(current_user):
    if current_user.role != 'admin':  # Only admins can add clerks
        return jsonify({'message': 'Permission denied!'}), 403

    data = request.get_json()
    required_fields = ['username', 'email', 'password']
    
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields!'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists!'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_clerk = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role='clerk',
        is_active=True  # No email verification needed for clerks
    )

    db.session.add(new_clerk)
    db.session.commit()

    return jsonify({'message': 'Clerk registered successfully!'}), 201

# User Login Route
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'message': 'Please verify your email before logging in!'}), 403

    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )

    return jsonify({'access_token': token, 'message': 'Login successful'}), 200
