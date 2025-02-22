import React, { useState, useEffect } from 'react';
import MyStores from './MyStores';
import MerchantReports from './MerchantReports';
import './merchant.css';
import api from '../services/api'; // Import API service

const MerchantDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionForm, setTransactionForm] = useState({
    product_id: '',
    store_id: '',
    quantity: '',
    payment_status: 'not paid',
  });

  // Fetch transactions when Transactions section is active
  useEffect(() => {
    if (activeSection === 'transactions') {
      fetchTransactions();
    }
  }, [activeSection]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleInputChange = (e) => {
    setTransactionForm({ ...transactionForm, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        // Update existing transaction
        await api.put(`/transactions/${editingTransaction.id}`, transactionForm);
        alert('Transaction updated successfully!');
      } else {
        // Add new transaction
        await api.post('/transactions', transactionForm);
        alert('Transaction added successfully!');
      }
      setEditingTransaction(null);
      setTransactionForm({ product_id: '', store_id: '', quantity: '', payment_status: 'not paid' });
      fetchTransactions(); // Refresh transaction list
    } catch (error) {
      alert('Failed to save transaction.');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      product_id: transaction.product_id,
      store_id: transaction.store_id,
      quantity: transaction.quantity,
      payment_status: transaction.payment_status,
    });
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${transactionId}`);
        alert('Transaction deleted successfully!');
        fetchTransactions();
      } catch (error) {
        alert('Failed to delete transaction.');
      }
    }
  };

  return (
    <div className="merchant-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="merchant-title">Merchant Panel</h2>
        <ul>
          <li><button onClick={() => setActiveSection('dashboard')}>Dashboard</button></li>
          <li><button onClick={() => setActiveSection('stores')}>View My Stores</button></li>
          <li><button onClick={() => setActiveSection('reports')}>Generate Reports</button></li>
          <li><button onClick={() => setActiveSection('transactions')}>Transactions</button></li>
          <li><button onClick={() => alert('Logging out...')}>Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === 'dashboard' && (
          <div className="dashboard-overview">
            <h1>Welcome, Merchant</h1>
            <p>Manage your stores and generate reports with ease.</p>
          </div>
        )}

        {activeSection === 'stores' && <MyStores />}
        {activeSection === 'reports' && <MerchantReports />}

        {activeSection === 'transactions' && (
          <div className="transactions-section">
            <h2>Transactions</h2>

            {/* Add/Edit Transaction Form */}
            <form className="transaction-form" onSubmit={handleAddTransaction}>
              <input
                type="text"
                name="product_id"
                placeholder="Product ID"
                value={transactionForm.product_id}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="store_id"
                placeholder="Store ID"
                value={transactionForm.store_id}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={transactionForm.quantity}
                onChange={handleInputChange}
                required
              />
              <select
                name="payment_status"
                value={transactionForm.payment_status}
                onChange={handleInputChange}
              >
                <option value="not paid">Not Paid</option>
                <option value="paid">Paid</option>
              </select>
              <button type="submit">{editingTransaction ? 'Update' : 'Add'} Transaction</button>
            </form>

            {/* Transactions List */}
            <div className="transaction-list">
              <h3>Transaction History</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Store</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Payment Status</th>
                    <th>Timestamp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.product_id}</td>
                      <td>{t.store_id}</td>
                      <td>{t.quantity}</td>
                      <td>${t.total_price}</td>
                      <td>{t.payment_status}</td>
                      <td>{new Date(t.timestamp).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleEditTransaction(t)}>Edit</button>
                        <button onClick={() => handleDeleteTransaction(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
