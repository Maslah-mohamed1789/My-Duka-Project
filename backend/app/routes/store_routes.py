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
    merchant_id = get_jwt_identity()
    new_store = Store(
        name=data['name'],
        location=data['location'],
        merchant_id=merchant_id  # Ensure store is linked to the authenticated merchant
    )
    db.session.add(new_store)
    db.session.commit()
    return jsonify({'message': 'Store created', 'store_id': new_store.id}), 201

@store_bp.route('/stores', methods=['GET'])
@jwt_required()
def get_stores():
    merchant_id = get_jwt_identity()
    stores = Store.query.filter_by(merchant_id=merchant_id).all()
    
    # Manually construct the response data
    stores_data = [
        {
            'id': store.id,
            'name': store.name,
            'location': store.location,
            'merchant_id': store.merchant_id
        }
        for store in stores
    ]
    
    return jsonify(stores_data), 200

@store_bp.route('/stores/<int:store_id>', methods=['GET'])
@jwt_required()
def get_store(store_id):
    merchant_id = get_jwt_identity()
    store = Store.query.filter_by(id=store_id, merchant_id=merchant_id).first()
    if not store:
        return jsonify({'message': 'Store not found'}), 404
    
    # Manually construct the response data
    store_data = {
        'id': store.id,
        'name': store.name,
        'location': store.location,
        'merchant_id': store.merchant_id
    }
    
    return jsonify(store_data), 200
# Update a store (only if it belongs to the merchant)
@store_bp.route('/stores/<int:store_id>', methods=['PUT'])
@jwt_required()
def update_store(store_id):
    merchant_id = get_jwt_identity()
    store = Store.query.filter_by(id=store_id, merchant_id=merchant_id).first()
    if not store:
        return jsonify({'message': 'Store not found or unauthorized'}), 403
    
    data = request.get_json()
    store.name = data.get('name', store.name)
    store.location = data.get('location', store.location)
    db.session.commit()
    return jsonify({'message': 'Store updated'}), 200

# Delete a store (only if it belongs to the merchant)
@store_bp.route('/stores/<int:store_id>', methods=['DELETE'])
@jwt_required()
def delete_store(store_id):
    merchant_id = get_jwt_identity()
    store = Store.query.filter_by(id=store_id, merchant_id=merchant_id).first()
    if not store:
        return jsonify({'message': 'Store not found or unauthorized'}), 403
    
    db.session.delete(store)
    db.session.commit()
    return jsonify({'message': 'Store deleted'}), 200
