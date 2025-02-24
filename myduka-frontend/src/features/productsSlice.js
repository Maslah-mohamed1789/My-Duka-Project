import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, addProduct } from '../services/productService';  // Correct import

export const fetchProductsThunk = createAsyncThunk('products/fetchProducts', async () => {
    return await fetchProducts();  // FIXED: Using correct function
});

export const addProductThunk = createAsyncThunk('products/addProduct', async (product) => {
    return await addProduct(product);  // FIXED: Using correct function
});

const productSlice = createSlice({
    name: 'products',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsThunk.pending, (state) => { state.loading = true; })
            .addCase(fetchProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProductsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProductThunk.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default productSlice.reducer;
