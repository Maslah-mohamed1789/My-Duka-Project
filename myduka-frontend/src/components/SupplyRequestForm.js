import React, { useState } from 'react';
import { createSupplyRequestAPI } from '../services/supplyRequestService';

const SupplyRequestForm = () => {
    const [request, setRequest] = useState({ product_id: '', quantity: '' });

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createSupplyRequestAPI(request);
        setRequest({ product_id: '', quantity: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-bold mb-2">Request Supply</h2>
            <input name="product_id" value={request.product_id} onChange={handleChange} placeholder="Product ID" className="border p-2 mb-2 w-full" required />
            <input name="quantity" type="number" value={request.quantity} onChange={handleChange} placeholder="Quantity" className="border p-2 mb-2 w-full" required />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Request</button>
        </form>
    );
};

export default SupplyRequestForm;
