import api from './api';  // ✅ Ensure API is imported

// Fetch all products
export const fetchProducts = async () => {
    const response = await api.get('/products');  // ✅ Replace with your actual endpoint
    return response.data;
};

// Add a new product
export const addProduct = async (product) => {
    const response = await api.post('/products', product);  // ✅ Replace with your actual endpoint
    return response.data;
};
