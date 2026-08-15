import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  stats: null,
  coupons: [],
  loading: false,
  error: null,
};

export const fetchAdminDashboardStats = createAsyncThunk('admin/fetchStats', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/analytics/dashboard', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load dashboard analytics');
  }
});

export const fetchCouponsAdmin = createAsyncThunk('admin/fetchCoupons', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/coupons', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load coupons');
  }
});

export const createCouponAdmin = createAsyncThunk('admin/createCoupon', async (couponData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.post('/api/coupons', couponData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
  }
});

export const deleteCouponAdmin = createAsyncThunk('admin/deleteCoupon', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await axios.delete(`/api/coupons/${id}`, config);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Coupons
      .addCase(fetchCouponsAdmin.fulfilled, (state, action) => { state.coupons = action.payload; })
      .addCase(createCouponAdmin.fulfilled, (state, action) => { state.coupons.unshift(action.payload); })
      .addCase(deleteCouponAdmin.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
      });
  }
});

export default adminSlice.reducer;
