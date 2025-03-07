import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './payment.css'; // Import the CSS file

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [inventoryId, setInventoryId] = useState('');
    const [status, setStatus] = useState('Pending');
    const [amount, setAmount] = useState('');  // New state for amount
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
        fetchPayments();
    }, []);

    const handlePostPayment = async (e) => {
        e.preventDefault();
        setPostError('');
        setSuccess('');

        // Parse and validate the amount
        const parsedAmount = parseFloat(amount);  // Convert to a number

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setPostError('Amount must be greater than zero.');
            return;
        }

        try {
            const response = await axios.post('https://my-duka-project-g25b.onrender.com/payment', {
                inventory_id: inventoryId,
                status: status,
                amount: parsedAmount // Send the parsed amount along with inventory_id and status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess(response.data.message);  // Success message
            // Optionally refresh the payment list after posting
            const newPaymentsResponse = await axios.get('https://my-duka-project-g25b.onrender.com/payment', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPayments(newPaymentsResponse.data.payments);  // Update the payment list
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

            {/* Payment List Table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Inventory ID</th>
                        <th>Status</th>
                        <th>Processed By</th>
                        <th>Amount</th> {/* New column for Amount */}
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.inventory_id}</td>
                            <td>{payment.status}</td>
                            <td>{payment.processed_by}</td>
                            <td>{payment.amount}</td> {/* Display Amount */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;