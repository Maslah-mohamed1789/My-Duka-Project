import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginAPI, register as registerAPI } from '../services/authService';

// Async thunk for user login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const user = await loginAPI(credentials);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
});

// Async thunk for user registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const user = await registerAPI(userData);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        user: JSON.parse(localStorage.getItem('user')) || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
