import datetime
from functools import wraps
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Product, SupplyRequest, Store, Transaction

api = Blueprint('api', __name__)

#########################################
# Utility: Role-Based Access Decorator
#########################################
def role_required(required_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if user and user.role in required_roles:
                return fn(*args, **kwargs)
            else:
                return jsonify({"message": "Access forbidden: insufficient permissions"}), 403
        return wrapper
    return decorator

############################
# Users CRUD Endpoints
############################
@api.route('/users', methods=['GET'])
@role_required(["merchant", "admin"])
def get_users():
    users = User.query.all()
    output = []
    for user in users:
        output.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        })
    return jsonify(output)

@api.route('/users', methods=['POST'])
@role_required(["merchant", "admin"])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'clerk')
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return {"message": "User already exists"}, 400
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()
    return {"message": "User created", "user_id": new_user.id}, 201

@api.route('/users/<int:user_id>', methods=['GET'])
@role_required(["merchant", "admin"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat()
    }

@api.route('/users/<int:user_id>', methods=['PUT'])
@role_required(["merchant", "admin"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if data.get('password'):
        user.password = generate_password_hash(data.get('password'))
    user.role = data.get('role', user.role)
    user.is_active = data.get('is_active', user.is_active)
    db.session.commit()
    return {"message": "User updated successfully"}

@api.route('/users/<int:user_id>', methods=['DELETE'])
@role_required(["merchant", "admin"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return {"message": "User deleted successfully"}

############################
# Product Endpoints
############################
@api.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    products = Product.query.all()
    output = []
    for product in products:
        output.append({
            "id": product.id,
            "product_name": product.product_name,
            "number_received": product.number_received,
            "stock": product.stock,
            "spoilt": product.spoilt,
            "buying_price": product.buying_price,
            "selling_price": product.selling_price,
            "payment_status": product.payment_status,
            "recorded_by": product.recorded_by,
            "created_at": product.created_at.isoformat()
        })
    return jsonify(output)

@api.route('/products', methods=['POST'])
@role_required(["clerk"])
def create_product():
    data = request.get_json()
    product_name = data.get('product_name')
    number_received = data.get('number_received')
    stock = data.get('stock')
    spoilt = data.get('spoilt', 0)
    buying_price = data.get('buying_price')
    selling_price = data.get('selling_price')
    payment_status = data.get('payment_status', "not_paid")
    current_user_id = get_jwt_identity()
    new_product = Product(
        product_name=product_name,
        number_received=number_received,
        stock=stock,
        spoilt=spoilt,
        buying_price=buying_price,
        selling_price=selling_price,
        payment_status=payment_status,
        recorded_by=current_user_id
    )
    db.session.add(new_product)
    db.session.commit()
    return {"message": "Product recorded successfully", "product_id": new_product.id}, 201

@api.route('/products/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return {
        "id": product.id,
        "product_name": product.product_name,
        "number_received": product.number_received,
        "stock": product.stock,
        "spoilt": product.spoilt,
        "buying_price": product.buying_price,
        "selling_price": product.selling_price,
        "payment_status": product.payment_status,
        "recorded_by": product.recorded_by,
        "created_at": product.created_at.isoformat()
    }

@api.route('/products/<int:product_id>', methods=['PUT'])
@role_required(["clerk", "admin"])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    product.product_name = data.get('product_name', product.product_name)
    product.number_received = data.get('number_received', product.number_received)
    product.stock = data.get('stock', product.stock)
    product.spoilt = data.get('spoilt', product.spoilt)
    product.buying_price = data.get('buying_price', product.buying_price)
    product.selling_price = data.get('selling_price', product.selling_price)
    product.payment_status = data.get('payment_status', product.payment_status)
    db.session.commit()
    return {"message": "Product updated successfully"}

@api.route('/products/<int:product_id>', methods=['DELETE'])
@role_required(["admin"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return {"message": "Product deleted successfully"}

############################
# SupplyRequest Endpoints
############################
@api.route('/supply_requests', methods=['GET'])
@role_required(["admin"])
def get_supply_requests():
    requests = SupplyRequest.query.all()
    output = []
    for req in requests:
        output.append({
            "id": req.id,
            "product_id": req.product_id,
            "requested_by": req.requested_by,
            "status": req.status,
            "created_at": req.created_at.isoformat(),
            "updated_at": req.updated_at.isoformat()
        })
    return jsonify(output)

@api.route('/supply_requests', methods=['POST'])
@role_required(["clerk"])
def create_supply_request():
    data = request.get_json()
    product_id = data.get('product_id')
    current_user_id = get_jwt_identity()
    Product.query.get_or_404(product_id)
    new_request = SupplyRequest(product_id=product_id, requested_by=current_user_id)
    db.session.add(new_request)
    db.session.commit()
    return {"message": "Supply request created", "request_id": new_request.id}, 201

@api.route('/supply_requests/<int:request_id>', methods=['GET'])
@role_required(["admin"])
def get_supply_request(request_id):
    req = SupplyRequest.query.get_or_404(request_id)
    return {
        "id": req.id,
        "product_id": req.product_id,
        "requested_by": req.requested_by,
        "status": req.status,
        "created_at": req.created_at.isoformat(),
        "updated_at": req.updated_at.isoformat()
    }

@api.route('/supply_requests/<int:request_id>', methods=['PUT'])
@role_required(["admin"])
def update_supply_request(request_id):
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ["approved", "declined"]:
        return {"message": "Invalid status"}, 400
    req = SupplyRequest.query.get_or_404(request_id)
    req.status = new_status
    db.session.commit()
    return {"message": f"Supply request {new_status}"}

@api.route('/supply_requests/<int:request_id>', methods=['DELETE'])
@role_required(["admin"])
def delete_supply_request(request_id):
    req = SupplyRequest.query.get_or_404(request_id)
    db.session.delete(req)
    db.session.commit()
    return {"message": "Supply request deleted successfully"}

############################
# Store Endpoints
############################
@api.route('/stores', methods=['GET'])
@role_required(["merchant", "admin"])
def get_stores():
    stores = Store.query.all()
    output = []
    for store in stores:
        output.append({
            "id": store.id,
            "store_name": store.store_name,
            "location": store.location,
            "created_at": store.created_at.isoformat(),
            "updated_at": store.updated_at.isoformat()
        })
    return jsonify(output)

@api.route('/stores', methods=['POST'])
@role_required(["merchant", "admin"])
def create_store():
    data = request.get_json()
    store_name = data.get('store_name')
    location = data.get('location')
    new_store = Store(store_name=store_name, location=location)
    db.session.add(new_store)
    db.session.commit()
    return {"message": "Store created", "store_id": new_store.id}, 201

@api.route('/stores/<int:store_id>', methods=['GET'])
@role_required(["merchant", "admin"])
def get_store(store_id):
    store = Store.query.get_or_404(store_id)
    return {
        "id": store.id,
        "store_name": store.store_name,
        "location": store.location,
        "created_at": store.created_at.isoformat(),
        "updated_at": store.updated_at.isoformat()
    }

@api.route('/stores/<int:store_id>', methods=['PUT'])
@role_required(["merchant", "admin"])
def update_store(store_id):
    store = Store.query.get_or_404(store_id)
    data = request.get_json()
    store.store_name = data.get('store_name', store.store_name)
    store.location = data.get('location', store.location)
    db.session.commit()
    return {"message": "Store updated successfully"}

@api.route('/stores/<int:store_id>', methods=['DELETE'])
@role_required(["merchant", "admin"])
def delete_store(store_id):
    store = Store.query.get_or_404(store_id)
    db.session.delete(store)
    db.session.commit()
    return {"message": "Store deleted successfully"}

############################
# Transaction Endpoints
############################
@api.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    transactions = Transaction.query.all()
    output = []
    for trans in transactions:
        output.append({
            "id": trans.id,
            "product_id": trans.product_id,
            "store_id": trans.store_id,
            "user_id": trans.user_id,
            "transaction_type": trans.transaction_type,
            "quantity": trans.quantity,
            "unit_price": trans.unit_price,
            "total_price": trans.total_price,
            "transaction_date": trans.transaction_date.isoformat(),
            "remarks": trans.remarks
        })
    return jsonify(output)

@api.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    data = request.get_json()
    product_id = data.get('product_id')
    store_id = data.get('store_id')
    user_id = get_jwt_identity()
    transaction_type = data.get('transaction_type')
    quantity = data.get('quantity')
    unit_price = data.get('unit_price')
    total_price = data.get('total_price')
    remarks = data.get('remarks')
    new_trans = Transaction(
        product_id=product_id,
        store_id=store_id,
        user_id=user_id,
        transaction_type=transaction_type,
        quantity=quantity,
        unit_price=unit_price,
        total_price=total_price,
        remarks=remarks
    )
    db.session.add(new_trans)
    db.session.commit()
    return {"message": "Transaction created", "transaction_id": new_trans.id}, 201

@api.route('/transactions/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    trans = Transaction.query.get_or_404(transaction_id)
    return {
        "id": trans.id,
        "product_id": trans.product_id,
        "store_id": trans.store_id,
        "user_id": trans.user_id,
        "transaction_type": trans.transaction_type,
        "quantity": trans.quantity,
        "unit_price": trans.unit_price,
        "total_price": trans.total_price,
        "transaction_date": trans.transaction_date.isoformat(),
        "remarks": trans.remarks
    }

@api.route('/transactions/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    trans = Transaction.query.get_or_404(transaction_id)
    data = request.get_json()
    trans.product_id = data.get('product_id', trans.product_id)
    trans.store_id = data.get('store_id', trans.store_id)
    trans.transaction_type = data.get('transaction_type', trans.transaction_type)
    trans.quantity = data.get('quantity', trans.quantity)
    trans.unit_price = data.get('unit_price', trans.unit_price)
    trans.total_price = data.get('total_price', trans.total_price)
    trans.remarks = data.get('remarks', trans.remarks)
    db.session.commit()
    return {"message": "Transaction updated successfully"}

@api.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    trans = Transaction.query.get_or_404(transaction_id)
    db.session.delete(trans)
    db.session.commit()
    return {"message": "Transaction deleted successfully"}
