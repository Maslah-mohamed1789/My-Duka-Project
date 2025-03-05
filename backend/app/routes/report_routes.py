from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Report, User, Inventory, SalesTransaction, Store
from datetime import datetime, timedelta
from sqlalchemy import or_
from sqlalchemy.orm import aliased

# Define blueprint
report_bp = Blueprint('report', __name__)

@report_bp.route('', methods=['POST'])
@jwt_required()
def generate_report():
    """
    Allows Admins and Merchants to generate reports based on sales transactions.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized. Only merchants and admins can generate reports'}), 403

    data = request.get_json()
    report_type = data.get('report_type', '').lower()
    store_id = data.get('store_id')

    if report_type == 'sales':
        total_sales = db.session.query(
            db.func.sum(SalesTransaction.total_price)
        ).join(Inventory).filter(
            Inventory.store_id == store_id
        ).scalar() or 0

        best_selling_product = db.session.query(
            Inventory.product_name,
            db.func.sum(SalesTransaction.quantity_sold).label('total_sold')
        ).join(SalesTransaction).filter(
            Inventory.store_id == store_id
        ).group_by(Inventory.product_name).order_by(db.desc('total_sold')).first()

        report_data = {
            "total_sales": total_sales,
            "best_selling_product": best_selling_product[0] if best_selling_product else "N/A"
        }
    
    elif report_type == 'stock':
        inventory_status = Inventory.query.filter_by(store_id=store_id).with_entities(
            Inventory.product_name, Inventory.quantity_in_stock).all()

        total_stock = sum([item[1] for item in inventory_status])

        report_data = {
            "inventory_status": [{"product": item[0], "stock": item[1]} for item in inventory_status]
        }
    else:
        return jsonify({'message': 'Invalid report type. Use "sales" or "stock".'}), 400

    new_report = Report(
        report_type=report_type,
        total_sales=total_sales if report_type == 'sales' else None,
        total_stock=total_stock if report_type == 'stock' else None,
        store_id=store_id,
        created_at=datetime.utcnow()
    )
    db.session.add(new_report)
    db.session.commit()

    return jsonify({'message': 'Report generated successfully', 'report_data': report_data}), 201

@report_bp.route('/store_performance/<int:store_id>', methods=['GET'])
@jwt_required()
def store_performance(store_id):
    """
    Get store performance, including total sales, top-selling products, and inventory breakdown.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['admin', 'merchant']:
        return jsonify({"error": "Unauthorized"}), 403

    if user.role.lower() == "merchant" and user.store_id != store_id:
        return jsonify({"error": "Unauthorized access to this store"}), 403

    store = Store.query.get(store_id)
    if not store:
        return jsonify({"error": "Store not found"}), 404

    total_sales = db.session.query(db.func.sum(SalesTransaction.total_price)).join(Inventory).filter(
        Inventory.store_id == store_id
    ).scalar() or 0

    top_products = (
        db.session.query(Inventory.product_name, db.func.sum(SalesTransaction.quantity_sold).label('total_sold'))
        .join(SalesTransaction).filter(Inventory.store_id == store_id)
        .group_by(Inventory.product_name)
        .order_by(db.desc('total_sold'))
        .limit(5)
        .all()
    )
    top_products_data = [{"product": p[0], "total_sold": p[1]} for p in top_products]

    inventory_status = Inventory.query.filter_by(store_id=store_id).with_entities(
        Inventory.product_name, Inventory.quantity_in_stock
    ).all()
    inventory_data = [{"product": item[0], "stock": item[1]} for item in inventory_status]

    return jsonify({
        "store_id": store_id,
        "total_sales": total_sales,
        "top_products": top_products_data,
        "inventory_status": inventory_data
    }), 200



@report_bp.route('/admin_reports', methods=['GET'])
@jwt_required()
def admin_reports():
    """
    Admin can see a detailed report on individual store performance with weekly, monthly, and annual filters.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role.lower() != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    report_type = request.args.get("report_type", "").lower()
    today = datetime.utcnow()

    # Define date filters
    if report_type == "weekly":
        start_date = today - timedelta(days=7)
    elif report_type == "monthly":
        start_date = today.replace(day=1)  # Start of the month
    elif report_type == "annual":
        start_date = today.replace(month=1, day=1)  # Start of the year
    else:
        return jsonify({"error": "Invalid report type. Use 'weekly', 'monthly', or 'annual'"}), 400

    store_reports = (
        db.session.query(
            Store.id, Store.name, db.func.sum(Report.total_sales).label('total_sales')
        )
        .join(Report, Report.store_id == Store.id)
        .filter(Report.created_at >= start_date)  # Filtering based on report creation date
        .group_by(Store.id, Store.name)
        .order_by(db.desc('total_sales'))
        .all()
    )

    return jsonify({
        "report_type": report_type,
        "admin_reports": [{"store_id": s[0], "store_name": s[1], "total_sales": s[2]} for s in store_reports]
    }), 200


@report_bp.route('/merchant_reports', methods=['GET'])
@jwt_required()
def merchant_reports():
    """
    Get reports for merchants with weekly, monthly, and annual filters.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role.lower() != 'merchant':
        return jsonify({"error": "Unauthorized"}), 403

    report_type = request.args.get("report_type", "").lower()
    today = datetime.utcnow()

    # Define date filters
    if report_type == "weekly":
        start_date = today - timedelta(days=7)
    elif report_type == "monthly":
        start_date = today.replace(day=1)
    elif report_type == "annual":
        start_date = today.replace(month=1, day=1)
    else:
        return jsonify({"error": "Invalid report type. Use 'weekly', 'monthly', or 'annual'"}), 400

    stores = Store.query.filter_by(merchant_id=user.id).all()
    report_data = []

    for store in stores:
        store_sales = (
            db.session.query(db.func.sum(Report.total_sales))
            .filter(Report.store_id == store.id, Report.created_at >= start_date)
            .scalar() or 0
        )

        report_data.append({
            "store_name": store.name,
            "total_sales": store_sales,
        })

    return jsonify({
        "report_type": report_type,
        "merchant_reports": report_data
    }), 200
