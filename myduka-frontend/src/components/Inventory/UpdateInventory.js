// src/components/Inventory/UpdateInventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './inventory.css'; // Import the CSS

const UpdateInventory = () => {
    const { inventoryId } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [inventoryItem, setInventoryItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInventoryItem = async () => {
            setIsLoading(true); // Set loading state
            try {
                const response = await axios.get(`https://my-duka-project-g25b.onrender.com/inventory/${inventoryId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setInventoryItem(response.data.inventory);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Failed to fetch inventory item');
            } finally {
                setIsLoading(false); // Reset loading state after fetch
            }
        };
        fetchInventoryItem();
    }, [inventoryId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            setIsLoading(true); // Set loading state during the update
            const response = await axios.put(`https://my-duka-project-g25b.onrender.com/inventory/${inventoryId}`, inventoryItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess(response.data.message);
            // Redirect to the inventory list after successful update
            navigate('/dashboard/inventory');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to update inventory item');
        } finally {
            setIsLoading(false); // Reset loading state after update
        }
    };

    if (isLoading) return <div>Loading...</div>;

    if (!inventoryItem) return <div>Inventory not found or loading failed.</div>;

    return (
        <div className="container">
            <h2>Update Inventory Item</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={inventoryItem.product_name}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, product_name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity Received"
                    value={inventoryItem.quantity_received}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, quantity_received: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity In Stock"
                    value={inventoryItem.quantity_in_stock}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, quantity_in_stock: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity Spoilt"
                    value={inventoryItem.quantity_spoilt}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, quantity_spoilt: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Buying Price"
                    value={inventoryItem.buying_price}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, buying_price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Selling Price"
                    value={inventoryItem.selling_price}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, selling_price: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Payment Status"
                    value={inventoryItem.payment_status}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, payment_status: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Supplier"
                    value={inventoryItem.supplier}
                    onChange={(e) => setInventoryItem({ ...inventoryItem, supplier: e.target.value })}
                    required
                />
                <button type="submit">Update Inventory</button>
            </form>
        </div>
    );
};

export default UpdateInventory;