import React, { useEffect, useState } from 'react';
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
import AdminReport from '../Report/AdminReports';
import SalesForm from '../Sales/SalesForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Get the user's name from local storage
        const storedUserName = localStorage.getItem('userName') || 'Admin';
        setUserName(storedUserName);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token'); 
        localStorage.removeItem('userName'); // Remove name on logout
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
                    <li><Link to="/dashboard/sales">Sales</Link></li>
                    <li><Link to="/dashboard/reports">Reports</Link></li>
                    <li><Link to="/dashboard/supply-requests">Supply Requests</Link></li>
                </ul>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
                <h1>Welcome, {userName}!</h1>  {/* Display the user’s name here */}
                <Routes>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="inventory/add" element={<AddInventory />} />
                    <Route path="inventory/update/:inventoryId" element={<UpdateInventory />} />
                    <Route path="inventory/assign" element={<AssignInventory />} />
                    <Route path="payments" element={<PaymentList />} />
                    <Route path="payments/process" element={<ProcessPayment />} />
                    <Route path="supply-requests" element={<SupplyRequestList />} />
                    <Route path="sales" element={<SalesForm />} />
                    <Route path="reports" element={<AdminReport />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
