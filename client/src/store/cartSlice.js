import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

let cartItemsFromStorage = [];
try {
  cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];
} catch (e) {
  cartItemsFromStorage = [];
}

let shippingAddressFromStorage = {};
try {
  shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};
} catch (e) {
  shippingAddressFromStorage = {};
}

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  coupon: null,
  couponDiscount: 0,
  loading: false,
  error: null,
  toastMessage: null,
};

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (code, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/coupons/validate', { code });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invalid coupon code');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? { ...x, quantity: item.quantity } : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      state.toastMessage = `Added "${item.name}" to cart!`;
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.couponDiscount = 0;
      localStorage.removeItem('cartItems');
    },
    clearToast: (state) => {
      state.toastMessage = null;
      state.error = null;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponDiscount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload.code;
        state.couponDiscount = action.payload.discountPercent;
        state.toastMessage = action.payload.message;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  clearCart,
  clearToast,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
