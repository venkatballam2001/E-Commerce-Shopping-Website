import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  createdOrder: null,
  currentOrder: null,
  myOrders: [],
  adminOrders: [],
  loading: false,
  orderDetailLoading: false,
  error: null,
  paymentSuccess: false,
};

export const createOrder = createAsyncThunk('order/createOrder', async (orderData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.post('/api/orders', orderData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to place order');
  }
});

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get(`/api/orders/${id}`, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Order not found');
  }
});

export const payOrder = createAsyncThunk('order/payOrder', async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment processing failed');
  }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/orders/myorders', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load order history');
  }
});

export const fetchAllOrdersAdmin = createAsyncThunk('order/fetchAllAdmin', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/orders', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load orders');
  }
});

export const updateOrderStatusAdmin = createAsyncThunk('order/updateStatusAdmin', async ({ orderId, status }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`/api/orders/${orderId}/status`, { status }, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.createdOrder = null;
      state.error = null;
      state.paymentSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Fetch Order Details
      .addCase(fetchOrderById.pending, (state) => { state.orderDetailLoading = true; state.currentOrder = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderDetailLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => { state.orderDetailLoading = false; state.error = action.payload; })
      // Pay Order
      .addCase(payOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.paymentSuccess = true;
      })
      // My Orders
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      // Admin Orders
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.adminOrders = action.payload;
      })
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        const order = state.adminOrders.find(o => o._id === action.payload._id);
        if (order) {
          order.orderStatus = action.payload.orderStatus;
          order.isDelivered = action.payload.isDelivered;
        }
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      });
  }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
