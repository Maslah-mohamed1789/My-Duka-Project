import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import AdminDashboard from './views/AdminDashboard';
import MerchantDashboard from './views/MerchantDashboard';
import ClerkDashboard from './views/ClerkDashboard';
import Navbar from './components/Navbar';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="p-4">
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'merchant' && <MerchantDashboard />}
        {user.role === 'clerk' && <ClerkDashboard />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/merchant" element={<MerchantDashboard />} />
          <Route path="/clerk" element={<ClerkDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
