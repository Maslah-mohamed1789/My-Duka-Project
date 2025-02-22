import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then(setProducts).catch(console.error); // Handle errors properly
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-3">Products</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Buying Price</th>
                        <th className="border p-2">Selling Price</th>
                        <th className="border p-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td className="border p-2">{product.name}</td>
                                <td className="border p-2">{product.buying_price}</td>
                                <td className="border p-2">{product.selling_price}</td>
                                <td className="border p-2">{product.stock_quantity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="border p-2 text-center">
                                No products available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
