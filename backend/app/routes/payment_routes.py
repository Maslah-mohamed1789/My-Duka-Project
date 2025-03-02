from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Payment, Inventory, User

# Define blueprint
payment_bp = Blueprint('payment', __name__)

# Process a Payment
@payment_bp.route('', methods=['POST'])
@jwt_required()
def process_payment():
    """
    Allows Admins and Merchants to process payments for inventory items.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role.lower() not in ['admin', 'merchant']:
        return jsonify({'message': 'Unauthorized. Only admins and merchants can process payments'}), 403

    data = request.get_json()

    # Validate inventory item exists
    inventory = Inventory.query.get(data.get('inventory_id'))
    if not inventory:
        return jsonify({'message': 'Invalid inventory_id'}), 400

    # Validate payment status
    allowed_statuses = ["Pending", "Paid", "Unpaid"]
    if data.get('status') not in allowed_statuses:
        return jsonify({'message': f'Invalid payment status. Allowed: {allowed_statuses}'}), 400

    # Validate amount
    amount = data.get('amount')
    if amount is None or amount <= 0:
        return jsonify({'message': 'Invalid amount. Amount must be greater than zero.'}), 400

    # Process the payment
    new_payment = Payment(
        inventory_id=inventory.id,
        status=data['status'],
        processed_by=user_id,
        amount=amount  # Include the amount in the payment
    )
    db.session.add(new_payment)

    # Update Inventory Payment Status
    inventory.payment_status = data['status']
    db.session.commit()

    return jsonify({
        'message': 'Payment processed successfully',
        'payment': {
            'id': new_payment.id,
            'inventory_id': new_payment.inventory_id,
            'status': new_payment.status,
            'processed_by': new_payment.processed_by,
            'amount': new_payment.amount  # Return the amount as part of the response
        }
    }), 201
# Get all payments
# Get all payments
@payment_bp.route('', methods=['GET'])
@jwt_required()
def get_payments():
    """
    Allows Admins to view all payments.
    Merchants can only view their own payments.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role.lower() == 'admin':
        payments = Payment.query.all()
    elif user.role.lower() == 'merchant':
        payments = Payment.query.filter_by(processed_by=user_id).all()
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    payment_list = [{
        'id': payment.id,
        'inventory_id': payment.inventory_id,
        'status': payment.status,
        'processed_by': payment.processed_by,
        'amount': payment.amount  # Include the amount in the response
    } for payment in payments]

    return jsonify({"payments": payment_list}), 200