import React from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import UserManagement from '../UserManagement'; // Ensure this is a default export
import AddInventory from '../Inventory/AddInventory'; // Ensure this is a default export
import InventoryList from '../Inventory/InventoryList'; // Ensure this is a default export
import UpdateInventory from '../Inventory/UpdateInventory'; // Ensure this is a default export
import AssignInventory from '../Inventory/AssignInventory'; // Ensure this is a default export
import ProcessPayment from '../Payment/ProcessPayment'; // Ensure this is a default export
import PaymentList from '../Payment/PaymentList'; // Ensure this is a default export
import SupplyRequestList from '../Supply/SupplyRequestList'; // Ensure this is a default export
import AdminReport from '../Report/AdminReports'; // Ensure this is a default export
import SalesForm from '../Sales/SalesForm'; // Ensure this is a default export
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        console.log("Logout button clicked"); // Debugging log
        try {
            dispatch(logout()); // Dispatch the logout action
            localStorage.removeItem('token'); // Clear the token
            navigate('/login'); // Navigate to the login page
        } catch (error) {
            console.error("Logout failed:", error); // Log any errors that occur during logout
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li><Link to="/dashboard/users">UserManagement</Link></li>
                    <li><Link to="/dashboard/inventory">Inventory Management</Link></li>
                    <li><Link to="/dashboard/payments">Payments</Link></li>
                    <li><Link to="/dashboard/sales">Sales</Link></li>
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
                    <Route path="sales" element={<SalesForm />} />
                    <Route path="reports" element={<AdminReport />} />  {/* Display Report List */}
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;