from flask import Blueprint, request, jsonify
from models import db, Product, Store, SupplyRequest, Transaction, User
from flask_jwt_extended import jwt_required, get_jwt_identity

routes_bp = Blueprint("routes", __name__)

# ======================== PRODUCT ROUTES =========================
@routes_bp.route("/products", methods=["POST"])
@jwt_required()
def add_product():
    data = request.get_json()
    new_product = Product(
        name=data["name"],
        description=data.get("description", ""),
        buying_price=data["buying_price"],
        selling_price=data["selling_price"],
        stock=data["stock"],
        store_id=data["store_id"]
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully"}), 201

@routes_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "buying_price": p.buying_price,
            "selling_price": p.selling_price,
            "stock": p.stock,
            "store_id": p.store_id
        } for p in products
    ])

@routes_bp.route("/products/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):
    data = request.get_json()
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.buying_price = data.get("buying_price", product.buying_price)
    product.selling_price = data.get("selling_price", product.selling_price)
    product.stock = data.get("stock", product.stock)
    db.session.commit()
    return jsonify({"message": "Product updated successfully"}), 200

@routes_bp.route("/products/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200

# ======================== STORE ROUTES =========================
@routes_bp.route("/stores", methods=["POST"])
@jwt_required()
def create_store():
    data = request.get_json()
    new_store = Store(
        name=data["name"],
        location=data["location"]
    )
    db.session.add(new_store)
    db.session.commit()
    return jsonify({"message": "Store added successfully"}), 201

@routes_bp.route("/stores", methods=["GET"])
def get_stores():
    stores = Store.query.all()
    return jsonify([
        {"id": s.id, "name": s.name, "location": s.location} for s in stores
    ])

@routes_bp.route("/stores/<int:id>", methods=["GET"])
def get_store(id):
    store = Store.query.get(id)
    if not store:
        return jsonify({"error": "Store not found"}), 404

    return jsonify({"id": store.id, "name": store.name, "location": store.location}), 200

@routes_bp.route("/stores/<int:id>", methods=["PUT"])
@jwt_required()
def update_store(id):
    data = request.get_json()
    store = Store.query.get(id)
    if not store:
        return jsonify({"error": "Store not found"}), 404

    store.name = data.get("name", store.name)
    store.location = data.get("location", store.location)
    db.session.commit()

    return jsonify({"message": "Store updated successfully"}), 200

@routes_bp.route("/stores/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_store(id):
    store = Store.query.get(id)
    if not store:
        return jsonify({"error": "Store not found"}), 404

    db.session.delete(store)
    db.session.commit()

    return jsonify({"message": "Store deleted successfully"}), 200

# ======================== TRANSACTION ROUTES =========================
@routes_bp.route("/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    data = request.get_json()
    user_id = get_jwt_identity()  # Get logged-in user ID

    product = Product.query.get(data["product_id"])
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if data["transaction_type"] == "sale":
        if product.stock < data["quantity"]:
            return jsonify({"error": "Not enough stock available"}), 400
        product.stock -= data["quantity"]
    elif data["transaction_type"] == "restock":
        product.stock += data["quantity"]

    new_transaction = Transaction(
        product_id=data["product_id"],
        clerk_id=user_id,
        transaction_type=data["transaction_type"],
        quantity=data["quantity"],
        total_amount=data["quantity"] * product.selling_price,
        payment_status=data.get("payment_status", "unpaid")
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({"message": "Transaction recorded"}), 201

@routes_bp.route("/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([
        {
            "id": t.id,
            "product_id": t.product_id,
            "clerk_id": t.clerk_id,
            "transaction_type": t.transaction_type,
            "quantity": t.quantity,
            "total_amount": t.total_amount,
            "payment_status": t.payment_status,
        } for t in transactions
    ])

@routes_bp.route("/transactions/<int:id>", methods=["GET"])
@jwt_required()
def get_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    return jsonify({
        "id": transaction.id,
        "product_id": transaction.product_id,
        "clerk_id": transaction.clerk_id,
        "transaction_type": transaction.transaction_type,
        "quantity": transaction.quantity,
        "total_amount": transaction.total_amount,
        "payment_status": transaction.payment_status,
    })

@routes_bp.route("/transactions/<int:id>", methods=["PUT"])
@jwt_required()
def update_transaction(id):
    data = request.get_json()
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    transaction.transaction_type = data.get("transaction_type", transaction.transaction_type)
    transaction.quantity = data.get("quantity", transaction.quantity)
    transaction.total_amount = data.get("total_amount", transaction.total_amount)
    transaction.payment_status = data.get("payment_status", transaction.payment_status)

    db.session.commit()
    return jsonify({"message": "Transaction updated successfully"}), 200

@routes_bp.route("/transactions/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({"message": "Transaction deleted successfully"}), 200
