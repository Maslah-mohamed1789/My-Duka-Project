import React from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import UserManagement from '../UserManagement'; 
import AddInventory from '../Inventory/AddInventory'; 
import InventoryList from '../Inventory/InventoryList'; 
import UpdateInventory from '../Inventory/UpdateInventory'; 
import AssignInventory from '../Inventory/AssignInventory'; 
import ProcessPayment from '../Payment/ProcessPayment'; 
import PaymentList from '../Payment/PaymentList'; 
import SupplyRequestList from '../Supply/SupplyRequestList'; 
import AdminReport from '../Report/AdminReports'
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li><Link to="/dashboard/users">User Management</Link></li>
                    <li><Link to="/dashboard/inventory">Inventory Management</Link></li>
                    <li><Link to="/dashboard/payments">Payments</Link></li>
                    <li><Link to="/dashboard/reports">Reports</Link></li>
                    <li><Link to="/dashboard/supply-requests">Supply Requests</Link></li>
                </ul>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
                <h1>Welcome, Admin!</h1>
                <Routes>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="inventory/add" element={<AddInventory />} />
                    <Route path="inventory/update/:inventoryId" element={<UpdateInventory />} />
                    <Route path="inventory/assign" element={<AssignInventory />} />
                    <Route path="payments" element={<PaymentList />} />
                    <Route path="payments/process" element={<ProcessPayment />} />
                    <Route path="supply-requests" element={<SupplyRequestList />} />
                    <Route path="reports" element={<AdminReport />} />  {/* Display Report List */}
                    
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
