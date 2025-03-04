import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './payment.css';

const ProcessPayment = () => {
    const navigate = useNavigate();
    const [inventoryId, setInventoryId] = useState('');
    const [status, setStatus] = useState('Pending');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate amount before sending the request
        if (amount <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        try {
            const response = await axios.post('https://my-duka-project-g25b.onrender.com/payment', {
                inventory_id: inventoryId,
                status: status,
                amount: amount // Send the amount along with inventory_id and status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess(response.data.message);
            navigate('/dashboard/payments'); // Redirect to payment list after successful submission
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to process payment');
        }
    };

    return (
        <div className="payment-container">
            <h2>Process Payment</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Inventory ID"
                    value={inventoryId}
                    onChange={(e) => setInventoryId(e.target.value)}
                    required
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                </select>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <button type="submit">Process Payment</button>
            </form>
        </div>
    );
};

export default ProcessPayment;
