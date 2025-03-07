// src/components/Inventory/AssignedInventory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignedInventory.css'; // Import the CSS file

const AssignedInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/inventory/assigned', {
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

    return (
        <div className="assigned-inventory-container">
            <h2 className="assigned-inventory-title">Assigned Inventory</h2>
            {error && <div className="error-message">{error}</div>}
            
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
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No assigned inventory found.</div>
            )}
        </div>
    );
};

export default AssignedInventory;
