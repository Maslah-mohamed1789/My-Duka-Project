from flask import Blueprint, jsonify, request, current_app
from .models import Product, User
from app import db  
from functools import wraps
import jwt  

bp = Blueprint('main', __name__)

# Token authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
            
            if not current_user:
                return jsonify({'message': 'Invalid token!'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    
    return decorated

# Store-Level Report (Admin Only)
@bp.route('/report/store', methods=['GET'])
@token_required
def store_report(current_user):
    if current_user.role != 'admin':
        return jsonify({'message': 'Permission denied'}), 403
    
    stores = db.session.query(Product.store_id).distinct().all()
    report_data = []

    for store in stores:
        store_id = store[0]  # Extract store_id from tuple
        products = Product.query.filter_by(store_id=store_id).all()

        total_revenue = sum(p.selling_price * p.stock_quantity for p in products)
        total_stock = sum(p.stock_quantity for p in products)
        spoiled_stock = sum(p.spoiled_quantity for p in products)
        paid_count = sum(1 for p in products if p.payment_status == 'paid')
        unpaid_count = sum(1 for p in products if p.payment_status == 'not paid')

        report_data.append({
            "store_id": store_id,
            "total_revenue": total_revenue,
            "total_stock": total_stock,
            "spoiled_stock": spoiled_stock,
            "payment_status": {
                "paid": paid_count,
                "unpaid": unpaid_count
            }
        })

    return jsonify({"store_performance": report_data}), 200

# Product Performance Report (Admin & Merchant)
@bp.route('/report/products', methods=['GET'])
@token_required
def product_report(current_user):
    if current_user.role not in ['admin', 'merchant']:
        return jsonify({'message': 'Permission denied'}), 403

    products = Product.query.all()

    # Sort top-selling products
    top_selling = sorted(products, key=lambda p: p.selling_price * p.stock_quantity, reverse=True)[:5]
    low_stock = sorted(products, key=lambda p: p.stock_quantity)[:5]
    spoiled = sorted(products, key=lambda p: p.spoiled_quantity, reverse=True)[:5]

    report_data = {
        "top_selling": [{"id": p.id, "name": p.name, "revenue": p.selling_price * p.stock_quantity} for p in top_selling],
        "low_stock": [{"id": p.id, "name": p.name, "stock_quantity": p.stock_quantity} for p in low_stock],
        "spoiled_products": [{"id": p.id, "name": p.name, "spoiled_quantity": p.spoiled_quantity} for p in spoiled]
    }

    return jsonify(report_data), 200

# General Report (Admin & Merchant)
@bp.route('/report', methods=['GET'])
@token_required
def generate_report(current_user):
    if current_user.role not in ['admin', 'merchant']:
        return jsonify({'message': 'Permission denied'}), 403

    report_type = request.args.get('type', 'store')  # Default to store-level

    if report_type == 'store':
        return store_report(current_user)
    elif report_type == 'products':
        return product_report(current_user)
    else:
        return jsonify({'message': 'Invalid report type'}), 400
    
    # Paid & Unpaid Product Listings (Admin Only)
@bp.route('/report/store/payments', methods=['GET'])
@token_required
def store_payment_report(current_user):
    if current_user.role != 'admin':
        return jsonify({'message': 'Permission denied'}), 403

    stores = db.session.query(Product.store_id).distinct().all()
    report_data = []

    for store in stores:
        store_id = store[0]  # Extract store_id from tuple
        paid_products = Product.query.filter_by(store_id=store_id, payment_status='paid').all()
        unpaid_products = Product.query.filter_by(store_id=store_id, payment_status='not paid').all()

        report_data.append({
            "store_id": store_id,
            "paid_products": [
                {"id": p.id, "name": p.name, "price": p.selling_price, "stock": p.stock_quantity} for p in paid_products
            ],
            "unpaid_products": [
                {"id": p.id, "name": p.name, "price": p.selling_price, "stock": p.stock_quantity} for p in unpaid_products
            ]
        })

    return jsonify({"store_payments": report_data}), 200


# Home Route
@bp.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'API is running!'}), 200

