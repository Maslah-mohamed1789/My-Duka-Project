import React, { useState } from 'react';
import { addProductAPI } from '../services/productService';

const ProductForm = ({ onProductAdded }) => {
    const [product, setProduct] = useState({
        name: '',
        buying_price: '',
        selling_price: '',
        stock_quantity: '',
        store_id: 1, // Default store for now
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addProductAPI(product);
        setProduct({ name: '', buying_price: '', selling_price: '', stock_quantity: '', store_id: 1 });
        onProductAdded();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-bold mb-2">Add Product</h2>
            <input name="name" value={product.name} onChange={handleChange} placeholder="Product Name" className="border p-2 mb-2 w-full" required />
            <input name="buying_price" type="number" value={product.buying_price} onChange={handleChange} placeholder="Buying Price" className="border p-2 mb-2 w-full" required />
            <input name="selling_price" type="number" value={product.selling_price} onChange={handleChange} placeholder="Selling Price" className="border p-2 mb-2 w-full" required />
            <input name="stock_quantity" type="number" value={product.stock_quantity} onChange={handleChange} placeholder="Stock Quantity" className="border p-2 mb-2 w-full" required />
            <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Add Product</button>
        </form>
    );
};

export default ProductForm;
