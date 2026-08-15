import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  usersList: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Async Thunks
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put('/api/auth/profile', userData, config);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Profile update failed');
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.post('/api/auth/address', addressData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add address');
  }
});

export const removeAddress = createAsyncThunk('auth/removeAddress', async (addressId, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.delete(`/api/auth/address/${addressId}`, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
  }
});

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/auth/users', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const toggleBlockUser = createAsyncThunk('auth/toggleBlockUser', async (userId, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`/api/auth/users/${userId}/block`, {}, config);
    return { userId, ...data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Action failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.usersList = [];
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Register
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Update Profile
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Addresses
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.userInfo) state.userInfo.addresses = action.payload;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        if (state.userInfo) state.userInfo.addresses = action.payload;
      })
      // Admin Users
      .addCase(fetchUsers.fulfilled, (state, action) => { state.usersList = action.payload; })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        const user = state.usersList.find(u => u._id === action.payload.userId);
        if (user) user.isBlocked = action.payload.isBlocked;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
