// src/components/Inventory/InventoryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './InventoryList.css';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/inventory', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setInventory(response.data.inventory);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Failed to fetch inventory');
            }
        };
        fetchInventory();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://my-duka-project-g25b.onrender.com/inventory/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setInventory(inventory.filter(item => item.id !== id));
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to delete inventory item');
        }
    };

    return (
        <div className="inventory-container">
            <h2 className="inventory-title">Inventory List</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="add-inventory-btn-container">
                <Link to="/dashboard/inventory/add">
                    <button className="add-inventory-btn">+ Add Inventory</button>
                </Link>
            </div>

            {inventory.length > 0 ? (
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity Received</th>
                            <th>In Stock</th>
                            <th>Quantity Spoilt</th>
                            <th>Buying Price ($)</th>
                            <th>Selling Price ($)</th>
                            <th>Payment Status</th>
                            <th>Supplier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id}>
                                <td>{item.product_name}</td>
                                <td>{item.quantity_received}</td>
                                <td>{item.quantity_in_stock}</td>
                                <td>{item.quantity_spoilt}</td>
                                <td>${item.buying_price.toFixed(2)}</td>
                                <td>${item.selling_price.toFixed(2)}</td>
                                <td>{item.payment_status}</td>
                                <td>{item.supplier}</td>
                                <td className="actions">
                                    <Link to={`/dashboard/inventory/update/${item.id}`} className="update-btn">
                                        Update
                                    </Link>
                                    <Link to={`/dashboard/inventory/assign`} className="assign-btn">
                                        Assign
                                    </Link>
                                    <button onClick={() => handleDelete(item.id)} className="delete-btn">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No inventory found.</div>
            )}
        </div>
    );
};

export default InventoryList;
