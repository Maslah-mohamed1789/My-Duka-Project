import React from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import InviteAdmin from '../Admin/InviteAdmin';
import AdminList from '../Admin/AdminList';
import AddInventory from '../Inventory/AddInventory'; 
import InventoryList from '../Inventory/InventoryList'; 
import UpdateInventory from '../Inventory/UpdateInventory'; 
import AssignInventory from '../Inventory/AssignInventory'; 
import MerchantPayments from '../Payment/MerchantPayment';
import MerchantReport from '../Report/MerchantReport';
import SalesForm from '../Sales/SalesForm';
import './MerchantDashboard.css';

const MerchantDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Merchant Dashboard</h2>
                <ul>
                    <li><Link to="/dashboard/inventory">Inventory Management</Link></li>
                    <li><Link to="/dashboard/payments">Payments</Link></li>
                    <li><Link to="/dashboard/reports">Reports</Link></li>
                    <li><Link to="/dashboard/sales">Sales</Link></li>
                    <li><Link to="/dashboard/admins">Manage Admins</Link></li>
                </ul>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
                <h1>Welcome, Merchant!</h1>
                <Routes>
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="inventory/add" element={<AddInventory />} />
                    <Route path="inventory/update/:inventoryId" element={<UpdateInventory />} />
                    <Route path="inventory/assign" element={<AssignInventory />} />
                    <Route path="payments" element={<MerchantPayments />} />
                    <Route path="sales" element={<SalesForm />} />
                    
                    <Route path="reports" element={<MerchantReport />} />
                    <Route path="admins" element={<AdminList />} />
                    <Route path="admins/invite" element={<InviteAdmin />} />
                </Routes>
            </div>
        </div>
    );
};

export default MerchantDashboard;