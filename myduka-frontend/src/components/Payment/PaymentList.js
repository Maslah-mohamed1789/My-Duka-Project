import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './payment.css'; // Import the CSS file

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);  // Fetch inventory items
    const [selectedInventoryId, setSelectedInventoryId] = useState('');
    const [status, setStatus] = useState('Pending');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [postError, setPostError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/payment', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPayments(response.data.payments);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Failed to fetch payments');
            }
        };

        const fetchInventoryItems = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/inventory', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setInventoryItems(response.data.inventory || []);  // Assuming the API returns an array
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        fetchPayments();
        fetchInventoryItems();
    }, []);

    const handlePostPayment = async (e) => {
        e.preventDefault();
        setPostError('');
        setSuccess('');

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setPostError('Amount must be greater than zero.');
            return;
        }

        try {
            const response = await axios.post('https://my-duka-project-g25b.onrender.com/payment', {
                inventory_id: selectedInventoryId,
                status: status,
                amount: parsedAmount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess(response.data.message);

            // Refresh payment list
            const newPaymentsResponse = await axios.get('https://my-duka-project-g25b.onrender.com/payment', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPayments(newPaymentsResponse.data.payments);
        } catch (error) {
            setPostError(error.response ? error.response.data.message : 'Failed to process payment');
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment List</h2>
            {error && <div className="error-message">{error}</div>}
            {postError && <div className="error-message">{postError}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Payment Form for Posting a New Payment */}
            <h3>Process Payment</h3>
            <form onSubmit={handlePostPayment}>
                <select
                    value={selectedInventoryId}
                    onChange={(e) => setSelectedInventoryId(e.target.value)}
                    required
                >
                    <option value="">Select Inventory Item</option>
                    {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                            {item.name} (ID: {item.id})
                        </option>
                    ))}
                </select>
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

            {/* Payment List Table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Inventory ID</th>
                        <th>Status</th>
                        <th>Processed By</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.inventory_id}</td>
                            <td>{payment.status}</td>
                            <td>{payment.processed_by}</td>
                            <td>{payment.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;
