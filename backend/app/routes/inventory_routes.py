from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Inventory, User, Store  # Add Store here
from sqlalchemy.exc import IntegrityError

# Define blueprint
inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('', methods=['POST'])
@jwt_required()
def add_inventory():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()

    # Check if all required fields are in the request
    required_fields = ['product_name', 'quantity_received', 'quantity_in_stock', 'quantity_spoilt',
                       'buying_price', 'selling_price', 'payment_status', 'supplier', 'store_id']
    
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

    # Check if the store exists
    store = Store.query.get(data['store_id'])
    if not store:
        return jsonify({'message': 'Store not found'}), 400

    try:
        new_inventory = Inventory(
            product_name=data['product_name'],
            quantity_received=data['quantity_received'],
            quantity_in_stock=data['quantity_in_stock'],
            quantity_spoilt=data['quantity_spoilt'],
            buying_price=data['buying_price'],
            selling_price=data['selling_price'],
            payment_status=data['payment_status'],
            supplier=data['supplier'],
            store_id=data['store_id'],
            store_admin_id=user.id  # Ensuring store admin is assigned
        )

        db.session.add(new_inventory)
        db.session.commit()

        return jsonify({
            'message': 'Inventory item added successfully',
            'inventory': {
                'id': new_inventory.id,
                'product_name': new_inventory.product_name,
                'quantity_received': new_inventory.quantity_received,
                'quantity_in_stock': new_inventory.quantity_in_stock,
                'quantity_spoilt': new_inventory.quantity_spoilt,
                'buying_price': new_inventory.buying_price,
                'selling_price': new_inventory.selling_price,
                'payment_status': new_inventory.payment_status,
                'supplier': new_inventory.supplier,
                'store_id': new_inventory.store_id,
                'store_admin_id': new_inventory.store_admin_id
            }
        }), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding inventory: {str(e)}'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Unexpected error: {str(e)}'}), 500


@inventory_bp.route('', methods=['GET'])
@jwt_required()
def get_inventory():
    """
    Allows Admins and Merchants to view only inventory items they added.
    Clerks can only view inventory items assigned to them.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role.lower() == 'admin':
        inventory = Inventory.query.filter_by(store_admin_id=user.id).all()  # Filter by admin who added it
    elif user.role.lower() == 'merchant':
        inventory = Inventory.query.filter(Inventory.store.has(merchant_id=user.id)).all()  # Filter by merchant's store
    elif user.role.lower() == 'clerk':
        inventory = user.managed_inventories  # Get assigned inventory items
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory_list = [{
        'id': item.id,
        'product_name': item.product_name,
        'quantity_received': item.quantity_received,
        'quantity_in_stock': item.quantity_in_stock,
        'quantity_spoilt': item.quantity_spoilt,
        'buying_price': item.buying_price,
        'selling_price': item.selling_price,
        'payment_status': item.payment_status,
        'supplier': item.supplier,
        'store_id': item.store_id  
    } for item in inventory]

    return jsonify({"inventory": inventory_list}), 200

# Update inventory item
@inventory_bp.route('/<int:inventory_id>', methods=['PUT'])
@jwt_required()
def update_inventory(inventory_id):
    """
    Allows Admins and Merchants to update existing inventory items.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory = Inventory.query.get_or_404(inventory_id)
    data = request.get_json()

    inventory.product_name = data.get('product_name', inventory.product_name)
    inventory.quantity_received = data.get('quantity_received', inventory.quantity_received)
    inventory.quantity_in_stock = data.get('quantity_in_stock', inventory.quantity_in_stock)
    inventory.quantity_spoilt = data.get('quantity_spoilt', inventory.quantity_spoilt)
    inventory.buying_price = data.get('buying_price', inventory.buying_price)
    inventory.selling_price = data.get('selling_price', inventory.selling_price)
    inventory.payment_status = data.get('payment_status', inventory.payment_status)
    inventory.supplier = data.get('supplier', inventory.supplier)

    db.session.commit()
    return jsonify({
        'message': 'Inventory item updated successfully',
        'inventory': {
            'id': inventory.id,
            'product_name': inventory.product_name,
            'quantity_received': inventory.quantity_received,
            'quantity_in_stock': inventory.quantity_in_stock,
            'quantity_sp oilt': inventory.quantity_spoilt,
            'buying_price': inventory.buying_price,
            'selling_price': inventory.selling_price,
            'payment_status': inventory.payment_status,
            'supplier': inventory.supplier
        }
    }), 200

# Delete inventory item
@inventory_bp.route('/<int:inventory_id>', methods=['DELETE'])
@jwt_required()
def delete_inventory(inventory_id):
    """
    Allows Admins and Merchants to delete inventory items.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory = Inventory.query.get_or_404(inventory_id)
    db.session.delete(inventory)
    db.session.commit()
    return jsonify({'message': 'Inventory item deleted successfully'}), 200

@inventory_bp.route('/assign', methods=['POST'])
@jwt_required()
def assign_inventory():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    print(f"Received data: {data}")  # Debugging line
    clerk_id = data.get('clerk_id')  
    inventory_ids = data.get('inventory_ids', [])

    clerk = User.query.filter_by(id=clerk_id, role="clerk").first()
    if not clerk:
        return jsonify({'message': 'Clerk not found'}), 404

    assigned_inventories = []

    for inv_id in inventory_ids:
        inventory = Inventory.query.get(inv_id)
        if inventory:
            clerk.managed_inventories.append(inventory)  # Assign the inventory
            assigned_inventories.append({
                'id': inventory.id,
                'product_name': inventory.product_name,
                'quantity_received': inventory.quantity_received,
                'quantity_in_stock': inventory.quantity_in_stock,
                'quantity_spoilt': inventory.quantity_spoilt,
                'buying_price': inventory.buying_price,
                'selling_price': inventory.selling_price,
                'payment_status': inventory.payment_status,
                'supplier': inventory.supplier,
                'store_id': inventory.store_id
            })

    try:
        db.session.commit()
        return jsonify({
            'message': f'Inventory successfully assigned to clerk ID {clerk.id}',
            'assigned_inventory': assigned_inventories  # Returning the assigned inventory
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error assigning inventory: {str(e)}'}), 500

@inventory_bp.route('/assigned', methods=['GET'])
@jwt_required()
def get_assigned_inventory():
    """
    Allows clerks to view inventory items assigned to them.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() != 'clerk':
        return jsonify({'message': 'Unauthorized. Only clerks can view assigned inventory.'}), 403

    # Fetch the inventories assigned to the clerk
    inventory = user.managed_inventories

    if not inventory:
        return jsonify({"message": "No inventory assigned to this clerk."}), 200

    # Create a list of dictionaries for each inventory item
    inventory_list = [{
        'id': item.id,
        'product_name': item.product_name,
        'quantity_received': item.quantity_received,
        'quantity_in_stock': item.quantity_in_stock,
        'quantity_spoilt': item.quantity_spoilt,
        'buying_price': item.buying_price,
        'selling_price': item.selling_price,
        'payment_status': item.payment_status,
        'supplier': item.supplier,
        'store_id': item.store_id
    } for item in inventory]

    return jsonify({"inventory": inventory_list}), 200

# Get a specific inventory item
@inventory_bp.route('/<int:inventory_id>', methods=['GET'])
@jwt_required()
def get_inventory_item(inventory_id):
    """
    Get a single inventory item by ID.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory = Inventory.query.get_or_404(inventory_id)
    return jsonify({
        'inventory': {
            'id': inventory.id,
            'product_name': inventory.product_name,
            'quantity_received': inventory.quantity_received,
            'quantity_in_stock': inventory.quantity_in_stock,
            'quantity_spoilt': inventory.quantity_spoilt,
            'buying_price': inventory.buying_price,
            'selling_price': inventory.selling_price,
            'payment_status': inventory.payment_status,
            'supplier': inventory.supplier
        }
    }), 200


@inventory_bp.route('/payment_status', methods=['GET'])
@jwt_required()
def inventory_payment_status():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role not in ['admin', 'merchant']:
        return jsonify({"error": "Unauthorized"}), 403

    payment_status = request.args.get('status')  # "paid" or "unpaid"
    print(f"Received payment status: {payment_status}")  # Debugging line

    if payment_status not in ["paid", "unpaid"]:
        return jsonify({"error": "Invalid payment status"}), 400

    query = Inventory.query.filter_by(payment_status=payment_status)

    if user.role == "merchant":
        query = query.filter(Inventory.store.has(merchant_id=user.id))

    inventory_items = query.all()
    inventory_data = [{"id": i.id, "product_name": i.product_name, "quantity": i.quantity_in_stock} for i in inventory_items]

    return jsonify({"inventory": inventory_data}), 200

