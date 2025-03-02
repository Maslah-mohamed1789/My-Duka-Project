// src/components/Dashboard/ClerkDashboard.js
import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import AssignedInventory from '../Inventory/AssignedInventory';
import RequestSupply from '../Supply/RequestSupply';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import './ClerkDashboard.css';

const ClerkDashboard = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2 className="dashboard-title">Clerk Dashboard</h2>
                <ul className="menu">
                    <li className={activeTab === 'inventory' ? 'active' : ''}>
                        <Link to="/dashboard/inventory" onClick={() => setActiveTab('inventory')}>
                            Assigned Inventory
                        </Link>
                    </li>
                    <li className={activeTab === 'requests' ? 'active' : ''}>
                        <Link to="/dashboard/requests" onClick={() => setActiveTab('requests')}>
                            Supply Requests
                        </Link>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            
            <div className="main-content">
                <Routes>
                    <Route path="/inventory" element={<AssignedInventory />} />
                    <Route path="/requests" element={<RequestSupply />} />
                </Routes>
            </div>
        </div>
    );
};

export default ClerkDashboard;