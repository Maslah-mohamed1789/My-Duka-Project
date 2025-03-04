import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SupplyRequest.css';

const SupplyRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/supply_request', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRequests(response.data.supply_requests);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Failed to fetch supply requests');
            }
        };

        fetchRequests();
    }, []);

    const handleUpdateStatus = async (requestId, status) => {
        try {
            await axios.put(`https://my-duka-project-g25b.onrender.com/supply_request/${requestId}`, { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Re-fetch the list after updating
            const updatedRequests = await axios.get('https://my-duka-project-g25b.onrender.com/supply_request', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRequests(updatedRequests.data.supply_requests);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to update supply request');
        }
    };

    const handleDeleteRequest = async (requestId) => {
        try {
            await axios.delete(`https://my-duka-project-g25b.onrender.com/supply_request/${requestId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Re-fetch the list after deletion
            const updatedRequests = await axios.get('https://my-duka-project-g25b.onrender.com/supply_request', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRequests(updatedRequests.data.supply_requests);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to delete supply request');
        }
    };

    return (
        <div>
            <h2>Supply Requests</h2>
            {error && <div className="error-message">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Requested</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.product_name}</td>
                            <td>{request.quantity_requested}</td>
                            <td>{request.status}</td>
                            <td>
                                <button onClick={() => handleUpdateStatus(request.id, 'Approved')}>Approve</button>
                                <button onClick={() => handleUpdateStatus(request.id, 'Declined')}>Decline</button>
                                <button onClick={() => handleDeleteRequest(request.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupplyRequestList;
