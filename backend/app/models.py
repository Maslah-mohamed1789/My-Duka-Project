from app import db, bcrypt

# Association Table for Many-to-Many (Clerks & Inventory)
clerk_inventory = db.Table(
    'clerk_inventory',
    db.Column('clerk_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('inventory_id', db.Integer, db.ForeignKey('inventory.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # Merchant, Admin, Clerk
    is_active = db.Column(db.Boolean, default=True)

    # Merchants manage stores
    managed_stores = db.relationship('Store', back_populates='merchant')

    # Merchants/Admins manage inventory
    inventories = db.relationship('Inventory', backref='store_admin', lazy=True, foreign_keys='Inventory.store_admin_id')

    # Clerks are linked to multiple inventories via the association table
    managed_inventories = db.relationship('Inventory', secondary=clerk_inventory, back_populates='clerks')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    merchant_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Merchant manages the store

    merchant = db.relationship('User', back_populates='managed_stores')
    inventories = db.relationship('Inventory', back_populates='store', lazy=True)
    reports = db.relationship('Report', back_populates='store')



class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    quantity_received = db.Column(db.Integer, nullable=False)
    quantity_in_stock = db.Column(db.Integer, nullable=False)
    quantity_spoilt = db.Column(db.Integer, nullable=False)
    buying_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)  # Paid, Unpaid
    supplier = db.Column(db.String(255), nullable=False)

    # Store admin (merchant) managing the inventory
    store_admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Store that holds this inventory
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)

    clerks = db.relationship('User', secondary=clerk_inventory, back_populates='managed_inventories')
    store = db.relationship('Store', back_populates='inventories')
    payment_status = db.Column(db.String(50), nullable=False, default="Unpaid")



class SupplyRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    quantity_requested = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="Pending")  # Pending, Approved, Declined
    clerk_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Set when approved/declined


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Paid, Unpaid
    processed_by = db.Column(db.Integer, db.ForeignKey('user.id'))  # Admin who updates status
    amount = db.Column(db.Float, nullable=False)  # Amount paid for the inventory item
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())  # Add this field


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String(50), nullable=False)  # Sales, Stock
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)

    # Fields to store computed data
    total_sales = db.Column(db.Float, nullable=True, default=0.0)  # Will be calculated for Sales Report
    total_stock = db.Column(db.Integer, nullable=True, default=0.0)  # Will be calculated for Stock Report

    store = db.relationship('Store', back_populates='reports')


class SalesTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)  # (quantity_sold * selling_price)
    sale_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    inventory = db.relationship('Inventory', backref='sales_transactions')


print("Models registered:", db.metadata.tables.keys())
