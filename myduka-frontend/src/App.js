import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Auth/Login';

import InviteAdmin from './components/Auth/InviteAdmin';

import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import MerchantDashboard from './components/Dashboard/MerchantDashboard';
import ClerkDashboard from './components/Dashboard/ClerkDashboard';

import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const userRole = useSelector((state) => state.auth.user?.role); // Get user role from Redux store
  console.log("User  Role:", userRole); // Debugging log

  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invite_admin" element={<InviteAdmin />} />
         
          
          {/* Dynamic routing based on user role */}
          {userRole === 'admin' && (
            <Route path="/dashboard/*" element={<AdminDashboard />} />
          )}
          {userRole === 'merchant' && (
            <Route path="/dashboard/*" element={<MerchantDashboard />} />
          )}
          {userRole === 'clerk' && (
            <Route path="/dashboard/*" element={<ClerkDashboard />} />
          )}
          
          
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;