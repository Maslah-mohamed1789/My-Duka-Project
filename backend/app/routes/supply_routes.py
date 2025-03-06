from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import SupplyRequest, User

# Define blueprint
supply_bp = Blueprint('supply', __name__)

# Clerk Creates a Supply Request
@supply_bp.route('', methods=['POST'])
@jwt_required()
def request_supply():
    """
    Allows Clerks to create supply requests for inventory items.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() != 'clerk':
        return jsonify({'message': 'Unauthorized. Only clerks can request supply'}), 403

    data = request.get_json()
    new_request = SupplyRequest(
        product_name=data['product_name'],
        quantity_requested=data['quantity_requested'],
        clerk_id=user_id
    )

    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Supply request submitted successfully'}), 201

@supply_bp.route('', methods=['GET'])
@jwt_required()
def get_supply_requests():
    """
    Admins only see supply requests they approved.
    Clerks only see their own supply requests.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'Unauthorized'}), 403

    if user.role.lower() == 'admin':
        # Admins only see supply requests they processed
        requests = SupplyRequest.query.filter_by(admin_id=user_id).all()
    elif user.role.lower() == 'clerk':
        # Clerks only see their own requests
        requests = SupplyRequest.query.filter_by(clerk_id=user_id).all()
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    request_list = [{
        'id': req.id,
        'product_name': req.product_name,
        'quantity_requested': req.quantity_requested,
        'status': req.status,
        'clerk_id': req.clerk_id,
        'admin_id': req.admin_id
    } for req in requests]

    return jsonify({"supply_requests": request_list}), 200

# Update a supply request
@supply_bp.route('/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_supply_request(request_id):
    """
    Allows Admins to approve or decline supply requests.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can update supply requests'}), 403

    supply_request = SupplyRequest.query.get_or_404(request_id)
    data = request.get_json()

    if 'status' in data:
        supply_request.status = data['status']
        supply_request.admin_id = user_id

    db.session.commit()
    return jsonify({'message': 'Supply request updated successfully'}), 200

# Delete a supply request
@supply_bp.route('/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_supply_request(request_id):
    """
    Allows Admins to delete supply requests.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can delete supply requests'}), 403

    request = SupplyRequest.query.get_or_404(request_id)
    db.session.delete(request)
    db.session.commit()
    return jsonify({'message': 'Supply request deleted successfully'}), 204