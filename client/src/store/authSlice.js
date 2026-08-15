import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

let userInfoFromStorage = null;
try {
  userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
} catch (e) {
  userInfoFromStorage = null;
}

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
    // Standalone Vercel Live Demo Fallback Authentication
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (normalizedEmail === 'admin@example.com' && password === 'password123') {
      const demoAdmin = {
        _id: 'admin_demo_id',
        name: 'Admin Manager',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        token: 'demo_jwt_admin_token_2026'
      };
      localStorage.setItem('userInfo', JSON.stringify(demoAdmin));
      return demoAdmin;
    }
    
    if (normalizedEmail === 'user@example.com' && password === 'password123') {
      const demoUser = {
        _id: 'user_demo_id',
        name: 'Alex Johnson',
        email: 'user@example.com',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        addresses: [
          {
            _id: 'addr_1',
            street: '742 Evergreen Terrace',
            city: 'Springfield',
            state: 'OR',
            postalCode: '97477',
            country: 'United States',
            isDefault: true
          }
        ],
        token: 'demo_jwt_user_token_2026'
      };
      localStorage.setItem('userInfo', JSON.stringify(demoUser));
      return demoUser;
    }

    if (email && password) {
      const customUser = {
        _id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        token: `demo_jwt_token_${Date.now()}`
      };
      localStorage.setItem('userInfo', JSON.stringify(customUser));
      return customUser;
    }

    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    // Standalone Vercel Live Demo Fallback Registration
    if (name && email && password) {
      const newDemoUser = {
        _id: `user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        addresses: [],
        token: `demo_jwt_token_${Date.now()}`
      };
      localStorage.setItem('userInfo', JSON.stringify(newDemoUser));
      return newDemoUser;
    }
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
    // Fallback profile update for live demo
    const { auth: { userInfo } } = getState();
    const updated = {
      ...userInfo,
      name: userData.name || userInfo.name,
      email: userData.email || userInfo.email,
      avatar: userData.avatar || userInfo.avatar
    };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    return updated;
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.post('/api/auth/address', addressData, config);
    return data;
  } catch (error) {
    const { auth: { userInfo } } = getState();
    const current = userInfo?.addresses || [];
    const updatedAddresses = [...current, { ...addressData, _id: `addr_${Date.now()}` }];
    const updatedUser = { ...userInfo, addresses: updatedAddresses };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedAddresses;
  }
});

export const removeAddress = createAsyncThunk('auth/removeAddress', async (addressId, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.delete(`/api/auth/address/${addressId}`, config);
    return data;
  } catch (error) {
    const { auth: { userInfo } } = getState();
    const current = userInfo?.addresses || [];
    const updatedAddresses = current.filter(a => a._id !== addressId);
    const updatedUser = { ...userInfo, addresses: updatedAddresses };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedAddresses;
  }
});

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/auth/users', config);
    return data;
  } catch (error) {
    // Fallback users list for Admin view
    return [
      { _id: 'admin_demo_id', name: 'Admin Manager', email: 'admin@example.com', role: 'admin', isBlocked: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { _id: 'user_demo_id', name: 'Alex Johnson', email: 'user@example.com', role: 'user', isBlocked: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }
    ];
  }
});

export const toggleBlockUser = createAsyncThunk('auth/toggleBlockUser', async (userId, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`/api/auth/users/${userId}/block`, {}, config);
    return { userId, ...data };
  } catch (error) {
    return { userId, isBlocked: true };
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartItems_guest');
      localStorage.removeItem('wishlist');
      localStorage.removeItem('wishlist_guest');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('shippingAddress_guest');
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
