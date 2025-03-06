from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import SalesTransaction, Inventory, User
from datetime import datetime

sales_bp = Blueprint('sales', __name__, url_prefix='/sales')

@sales_bp.route('', methods=['POST'])
@jwt_required()
def create_sale():
    """ Create a new sales transaction. """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized. Only merchants and admins can create sales'}), 403
    
    data = request.get_json()
    inventory_id = data.get('inventory_id')
    quantity_sold = data.get('quantity_sold')
    total_price = data.get('total_price')
    
    inventory = Inventory.query.get(inventory_id)
    if not inventory:
        return jsonify({'message': 'Inventory item not found'}), 404
    
    if inventory.quantity_in_stock < quantity_sold:
        return jsonify({'message': 'Not enough stock available'}), 400
    
    # Deduct from inventory
    inventory.quantity_in_stock -= quantity_sold
    
    new_sale = SalesTransaction(
        inventory_id=inventory_id,
        quantity_sold=quantity_sold,
        total_price=total_price,
        sale_date=datetime.utcnow()
    )
    
    db.session.add(new_sale)
    db.session.commit()
    
    return jsonify({'message': 'Sale recorded successfully', 'sale_id': new_sale.id}), 201

@supply_bp.route('', methods=['GET'])
@jwt_required()
def get_supply_requests():
    """
    Retrieve supply requests. Admins see only their requests.
    Merchants see only requests related to their store.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'Unauthorized'}), 403

    # Admins can only view supply requests they processed
    if user.role.lower() == 'admin':
        supply_requests = SupplyRequest.query.filter_by(processed_by=user_id).all()
    
    # Merchants can only view supply requests for their store
    elif user.role.lower() == 'merchant':
        supply_requests = SupplyRequest.query.filter_by(store_admin_id=user_id).all()
    
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    supply_data = [
        {
            'id': request.id,
            'inventory_id': request.inventory_id,
            'quantity_requested': request.quantity_requested,
            'status': request.status,
            'processed_by': request.processed_by
        }
        for request in supply_requests
    ]

    return jsonify({'supply_requests': supply_data}), 200

@sales_bp.route('/<int:sale_id>', methods=['GET'])
@jwt_required()
def get_sale(sale_id):
    """ Retrieve a specific sales transaction. """
    sale = SalesTransaction.query.get(sale_id)
    if not sale:
        return jsonify({'message': 'Sale not found'}), 404
    
    sale_data = {
        'id': sale.id,
        'inventory_id': sale.inventory_id,
        'quantity_sold': sale.quantity_sold,
        'total_price': sale.total_price,
        'sale_date': sale.sale_date
    }
    return jsonify(sale_data), 200

@sales_bp.route('/<int:sale_id>', methods=['PUT'])
@jwt_required()
def update_sale(sale_id):
    """ Update a sales transaction (Admins only). """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    sale = SalesTransaction.query.get(sale_id)
    if not sale:
        return jsonify({'message': 'Sale not found'}), 404
    
    data = request.get_json()
    sale.quantity_sold = data.get('quantity_sold', sale.quantity_sold)
    sale.total_price = data.get('total_price', sale.total_price)
    db.session.commit()
    
    return jsonify({'message': 'Sale updated successfully'}), 200

@sales_bp.route('/<int:sale_id>', methods=['DELETE'])
@jwt_required()
def delete_sale(sale_id):
    """ Delete a sales transaction (Admins only). """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    sale = SalesTransaction.query.get(sale_id)
    if not sale:
        return jsonify({'message': 'Sale not found'}), 404
    
    db.session.delete(sale)
    db.session.commit()
    
    return jsonify({'message': 'Sale deleted successfully'}), 200
