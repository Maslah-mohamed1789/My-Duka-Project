import React, { useState, useEffect } from 'react';
import api from '../services/api'; // API service for backend calls
import './clerk.css';

const ClerkDashboard = () => {
  const [activeSection, setActiveSection] = useState('viewStock');
  const [products, setProducts] = useState([]);
  const [supplyRequest, setSupplyRequest] = useState({ product_id: '', quantity_requested: '' });
  const [newProduct, setNewProduct] = useState({ name: '', stock_quantity: '', selling_price: '', spoiled_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleRequestSupply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/request_supply', supplyRequest);
      alert('Supply request submitted successfully!');
      setSupplyRequest({ product_id: '', quantity_requested: '' });
    } catch (error) {
      alert('Failed to submit supply request.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/product/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      stock_quantity: product.stock_quantity,
      selling_price: product.selling_price,
      spoiled_quantity: product.spoiled_quantity,
    });
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await api.put(`/product/${editingProduct.id}`, newProduct);
      } else {
        await api.post('/product', newProduct);
      }
      fetchProducts();
      setNewProduct({ name: '', stock_quantity: '', selling_price: '', spoiled_quantity: '' });
      setEditingProduct(null);
    } catch (error) {
      alert('Failed to save product.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="clerk-container">
      <div className="sidebar">
        <h2>Clerk Panel</h2>
        <ul>
          <li><button onClick={() => setActiveSection('viewStock')}>View Stock</button></li>
          <li><button onClick={() => setActiveSection('requestSupply')}>Request Supplies</button></li>
          <li><button onClick={() => setActiveSection('manageProducts')}>Manage Products</button></li>
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
                      <button onClick={() => handleEditProduct(p)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeSection === 'requestSupply' && (
          <div className="request-supply">
            <h2>Request Supplies</h2>
            <form onSubmit={handleRequestSupply}>
              <select
                name="product_id"
                value={supplyRequest.product_id}
                onChange={(e) => setSupplyRequest({ ...supplyRequest, product_id: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input 
                type="number" 
                name="quantity_requested" 
                placeholder="Quantity" 
                value={supplyRequest.quantity_requested} 
                onChange={(e) => setSupplyRequest({ ...supplyRequest, quantity_requested: e.target.value })} 
                required 
              />
              <button type="submit">Submit Request</button>
            </form>
          </div>
        )}

        {activeSection === 'manageProducts' && (
          <div className="manage-products">
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock_quantity}
              onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="Spoiled Quantity"
              value={newProduct.spoiled_quantity}
              onChange={(e) => setNewProduct({ ...newProduct, spoiled_quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="Selling Price"
              value={newProduct.selling_price}
              onChange={(e) => setNewProduct({ ...newProduct, selling_price: e.target.value })}
            />
            <button onClick={handleSaveProduct}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkDashboard;
