import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://my-duka-project-g25b.onrender.com'; // Your backend API URL

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

// Async thunk for login
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data; // { access_token, role }
    } catch (error) {
        console.error('Login error:', error.response.data); // Log the error response
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { email: action.payload.email, role: action.payload.role };
                state.token = action.payload.access_token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export the logout action
export const { logout } = authSlice.actions;
export default authSlice.reducer;