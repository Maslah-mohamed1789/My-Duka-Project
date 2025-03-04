# app/routes/store_routes.py

from flask import Blueprint, request, jsonify
from app import db
from app.models import Store  # Make sure to import your Store model
from flask_jwt_extended import jwt_required, get_jwt_identity

store_bp = Blueprint('store', __name__)

# Create a new store
@store_bp.route('/stores', methods=['POST'])
@jwt_required()
def create_store():
    data = request.get_json()
    new_store = Store(
        name=data['name'],
        location=data['location'],
        merchant_id=get_jwt_identity()  # Assuming the merchant ID is the JWT identity
    )
    db.session.add(new_store)
    db.session.commit()
    return jsonify({'message': 'Store created', 'store_id': new_store.id}), 201

# Get all stores
@store_bp.route('/stores', methods=['GET'])
@jwt_required()
def get_stores():
    stores = Store.query.all()
    return jsonify([store.to_dict() for store in stores]), 200

# Get a specific store by ID
@store_bp.route('/stores/<int:store_id>', methods=['GET'])
@jwt_required()
def get_store(store_id):
    store = Store.query.get_or_404(store_id)
    return jsonify(store.to_dict()), 200

# Update a store
@store_bp.route('/stores/<int:store_id>', methods=['PUT'])
@jwt_required()
def update_store(store_id):
    store = Store.query.get_or_404(store_id)
    data = request.get_json()
    store.name = data.get('name', store.name)
    store.location = data.get('location', store.location)
    db.session.commit()
    return jsonify({'message': 'Store updated'}), 200

# Delete a store
@store_bp.route('/stores/<int:store_id>', methods=['DELETE'])
@jwt_required()
def delete_store(store_id):
    store = Store.query.get_or_404(store_id)
    db.session.delete(store)
    db.session.commit()
    return jsonify({'message': 'Store deleted'}), 200

    