import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import productReducer from './features/productsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
    },
});

export default store;
