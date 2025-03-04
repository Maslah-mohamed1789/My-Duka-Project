from flask import Blueprint, request, jsonify, current_app as app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt, mail
from app.models import User
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message

# Define blueprint
auth_bp = Blueprint('auth', __name__)

def create_serializer(secret_key):
    return URLSafeTimedSerializer(secret_key)

# Register Merchant (Self-registration, no Admin approval needed)
@auth_bp.route('/register_merchant', methods=['POST'])
def register_merchant():
    """
    Allows a new user to register as a Merchant without requiring admin approval.
    """
    data = request.get_json()
    
    # Check if the email is already in use
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], email=data['email'], password_hash=hashed_password, role='Merchant')
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Merchant registered successfully'}), 201


# User registration (only Admins can add Clerks)
@auth_bp.route('/register_clerk', methods=['POST'])
@jwt_required()
def register_clerk():
    """
    Allows an Admin to register a new Clerk.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    
    if current_user.role.lower() != 'admin':
        return jsonify({'message': 'Only Admins can add Clerks'}), 403
    
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], email=data['email'], password_hash=hashed_password, role='clerk')
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Clerk registered successfully'}), 201

# User login
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Allows any user (Admin, Merchant, Clerk) to log in and receive a JWT token.
    """
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'role': user.role}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Invite Admin (Only Merchants can invite Admins)
@auth_bp.route('/invite_admin', methods=['POST'])
@jwt_required()
def invite_admin():
    """
    Allows a Merchant to send an invitation to a new Admin via email.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    
    if current_user.role.lower() != 'merchant':
        return jsonify({'message': 'Only Merchants can invite Admins'}), 403
    
    data = request.get_json()
    email = data['email']
    s = create_serializer(app.config['SECRET_KEY'])
    token = s.dumps(email, salt='admin-registration')
    send_invitation_email(email, token)
    
    return jsonify({'message': 'Invitation sent successfully'}), 200

def send_invitation_email(email, token):
    """
    Sends an email invitation to the new Admin with a registration link.
    """
    msg = Message('Admin Registration Invitation', recipients=[email])
    link = f"http://yourfrontend.com/register_with_token/{token}"
    msg.body = f'Click the link to register: {link}'
    mail.send(msg)

@auth_bp.route('/register_with_token/<token>', methods=['POST'])
def register_with_token(token):
    """
    Allows a new Admin to register using the token sent via email.
    """
    s = create_serializer(app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='admin-registration', max_age=3600)  # Decode the token
    except Exception as e:
        return jsonify({'message': 'Invalid or expired token'}), 400  # Handle invalid token

    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], email=email, password_hash=hashed_password, role='admin')
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Admin registered successfully'}), 201

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_clerks():
    """
    Allows an Admin to get a list of all Clerks.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if current_user.role.lower() != 'admin':
        return jsonify({'message': 'Only Admins can view clerks'}), 403

    clerks = User.query.filter_by(role='clerk').all()
    clerk_data = [{'id': clerk.id, 'username': clerk.username, 'email': clerk.email, 'role': clerk.role} for clerk in clerks]

    return jsonify({'clerks': clerk_data}), 200

# Delete Clerk (DELETE request)
@auth_bp.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_clerk(id):
    """
    Allows an Admin to delete a specific Clerk.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if current_user.role.lower() != 'admin':
        return jsonify({'message': 'Only Admins can delete clerks'}), 403

    clerk = User.query.get(id)
    if not clerk or clerk.role.lower() != 'clerk':
        return jsonify({'message': 'Clerk not found'}), 404

    db.session.delete(clerk)
    db.session.commit()
    return jsonify({'message': 'Clerk deleted successfully'}), 200
# Deactivate Admin (Only Merchants can deactivate)
@auth_bp.route('/deactivate_admin/<int:id>', methods=['PATCH'])
@jwt_required()
def deactivate_admin(id):
    """
    Allows a Merchant to deactivate an Admin account.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if current_user.role.lower() != 'merchant':
        return jsonify({'message': 'Only Merchants can deactivate Admins'}), 403

    admin = User.query.get(id)
    if not admin or admin.role.lower() != 'admin':
        return jsonify({'message': 'Admin not found'}), 404

    admin.is_active = False  # Deactivate the admin account
    db.session.commit()
    return jsonify({'message': f'Admin with ID {id} deactivated successfully'}), 200

# Delete Admin (Only Merchants can delete)
@auth_bp.route('/delete_admin/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_admin(id):
    """
    Allows a Merchant to delete an Admin account.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if current_user.role.lower() != 'merchant':
        return jsonify({'message': 'Only Merchants can delete Admins'}), 403

    admin = User.query.get(id)
    if not admin or admin.role.lower() != 'admin':
        return jsonify({'message': 'Admin not found'}), 404

    db.session.delete(admin)
    db.session.commit()
    return jsonify({'message': f'Admin with ID {id} deleted successfully'}), 200
@auth_bp.route('/admins', methods=['GET'])
@jwt_required()
def get_all_admins():
    """
    Allows a Merchant to get a list of all Admins.
    """
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if current_user.role.lower() != 'merchant':
        return jsonify({'message': 'Only Merchants can view Admins'}), 403

    admins = User.query.filter_by(role='admin').all()
    admin_data = [{'id': admin.id, 'username': admin.username, 'email': admin.email, 'role': admin.role} for admin in admins]

    return jsonify({'admins': admin_data}), 200