import { createSlice } from '@reduxjs/toolkit';
import { fetchSupplyRequestsAPI, createSupplyRequestAPI } from '../services/supplyRequestService';

const initialState = {
    supplyRequests: [],
    loading: false,
    error: null,
};

const supplyRequestSlice = createSlice({
    name: 'supplyRequest',
    initialState,
    reducers: {
        setSupplyRequests: (state, action) => {
            state.supplyRequests = action.payload;
        },
        addSupplyRequest: (state, action) => {
            state.supplyRequests.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setSupplyRequests, addSupplyRequest, setLoading, setError } = supplyRequestSlice.actions;

export const fetchSupplyRequests = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const data = await fetchSupplyRequestsAPI();
        dispatch(setSupplyRequests(data));
    } catch (error) {
        dispatch(setError(error.message));
    }
    dispatch(setLoading(false));
};

export const createSupplyRequest = (requestData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const newRequest = await createSupplyRequestAPI(requestData);
        dispatch(addSupplyRequest(newRequest));
    } catch (error) {
        dispatch(setError(error.message));
    }
    dispatch(setLoading(false));
};

export default supplyRequestSlice.reducer;
