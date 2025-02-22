import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './views/AdminDashboard';
import MerchantDashboard from './views/MerchantDashboard';
import ClerkDashboard from './views/ClerkDashboard';
import Navbar from './components/Navbar';
import LoginPage from './views/LoginPage';

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div>
            {/* Navbar is now shown only when the user is logged in */}
            <Navbar user={user} />
            <div className="p-4">
                {user.role === 'admin' && <AdminDashboard />}
                {user.role === 'merchant' && <MerchantDashboard />}
                {user.role === 'clerk' && <ClerkDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
