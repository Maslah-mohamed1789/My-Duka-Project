import { createSlice } from '@reduxjs/toolkit';
import { fetchReportsAPI } from '../services/reportService';

const initialState = {
    reports: {},
    loading: false,
    error: null,
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setReports: (state, action) => {
            state.reports = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setReports, setLoading, setError } = reportSlice.actions;

export const fetchReports = (period) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await fetchReportsAPI(period);
        dispatch(setReports(data));
    } catch (error) {
        dispatch(setError(error.message));
    }
    dispatch(setLoading(false));
};

export default reportSlice.reducer;
