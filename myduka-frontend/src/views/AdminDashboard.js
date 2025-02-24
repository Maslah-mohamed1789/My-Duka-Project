import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './admin.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('viewStock');
  const [products, setProducts] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchSupplyRequests();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSupplyRequests = async () => {
    try {
      const response = await api.get('/supply_requests');
      setSupplyRequests(response.data);
    } catch (error) {
      console.error('Error fetching supply requests:', error);
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await api.put(`/supply_request/${id}`, { action: 'approve' });
      fetchSupplyRequests();
      fetchProducts();
    } catch (error) {
      alert('Failed to approve request.');
    }
  };

  const handleDeclineRequest = async (id) => {
    try {
      await api.put(`/supply_request/${id}`, { action: 'decline' });
      fetchSupplyRequests();
    } catch (error) {
      alert('Failed to decline request.');
    }
  };

  const handleUpdatePayment = async (id, status) => {
    try {
      await api.put(`/product/${id}/payment`, { payment_status: status });
      fetchProducts();
    } catch (error) {
      alert('Failed to update payment status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><button onClick={() => setActiveSection('viewStock')}>View Stock</button></li>
          <li><button onClick={() => setActiveSection('manageRequests')}>Manage Supply Requests</button></li>
          <li><button onClick={() => setActiveSection('generateReports')}>Generate Reports</button></li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        {activeSection === 'viewStock' && (
          <div className="stock-section">
            <h2>Stock Overview</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Spoiled</th>
                  <th>Price</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.stock_quantity}</td>
                    <td>{p.spoiled_quantity}</td>
                    <td>${p.selling_price}</td>
                    <td>{p.payment_status}</td>
                    <td>
                      <button onClick={() => handleUpdatePayment(p.id, 'paid')}>Mark as Paid</button>
                      <button onClick={() => handleUpdatePayment(p.id, 'not paid')}>Mark as Unpaid</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'manageRequests' && (
          <div className="manage-requests">
            <h2>Manage Supply Requests</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplyRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.product_name}</td>
                    <td>{req.quantity_requested}</td>
                    <td>{req.status}</td>
                    <td>
                      {req.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveRequest(req.id)}>Approve</button>
                          <button onClick={() => handleDeclineRequest(req.id)}>Decline</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'generateReports' && (
          <div className="reports-section">
            <h2>Generate Reports</h2>
            <p>Report generation feature coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
