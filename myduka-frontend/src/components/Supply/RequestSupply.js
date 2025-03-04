import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestSupply = () => {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [requests, setRequests] = useState([]); // State to store supply requests

    // Fetch supply requests when component mounts
    useEffect(() => {
        fetchSupplyRequests();
    }, []);

    const fetchSupplyRequests = async () => {
        try {
            const response = await axios.get('https://my-duka-project-g25b.onrender.com/supply_request', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRequests(response.data.supply_requests);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch requests');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(
                'https://my-duka-project-g25b.onrender.com/supply_request',
                {
                    product_name: productName,
                    quantity_requested: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setMessage(response.data.message);
            setProductName('');
            setQuantity('');
            fetchSupplyRequests(); // Refresh the list after submitting
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to submit request');
        }
    };

    return (
        <div>
            <h2>Request Supply</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Product Name:
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Submit Request</button>
            </form>

            <h3>Your Supply Requests</h3>
            <ul>
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <li key={req.id}>
                            {req.product_name} - {req.quantity_requested} (Status: {req.status})
                        </li>
                    ))
                ) : (
                    <p>No supply requests found</p>
                )}
            </ul>
        </div>
    );
};

export default RequestSupply;
