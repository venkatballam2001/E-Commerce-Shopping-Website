import { createSlice } from '@reduxjs/toolkit';
import { logout, login, register } from './authSlice';

const getWishlistKey = () => {
  try {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    return userInfo?._id ? `wishlist_${userInfo._id}` : 'wishlist_guest';
  } catch (e) {
    return 'wishlist_guest';
  }
};

let wishlistFromStorage = [];
try {
  const key = getWishlistKey();
  wishlistFromStorage = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : localStorage.getItem('wishlist')
    ? JSON.parse(localStorage.getItem('wishlist'))
    : [];
} catch (e) {
  wishlistFromStorage = [];
}

const initialState = {
  items: wishlistFromStorage,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item._id === product._id);
      if (exists) {
        state.items = state.items.filter((item) => item._id !== product._id);
      } else {
        state.items.push(product);
      }
      const key = getWishlistKey();
      localStorage.setItem(key, JSON.stringify(state.items));
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      const key = getWishlistKey();
      localStorage.setItem(key, JSON.stringify(state.items));
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      const key = getWishlistKey();
      localStorage.removeItem(key);
      localStorage.removeItem('wishlist');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = [];
        localStorage.removeItem('wishlist');
        localStorage.removeItem('wishlist_guest');
      })
      .addCase(login.fulfilled, (state, action) => {
        const userId = action.payload?._id;
        if (userId) {
          const userWishlistKey = `wishlist_${userId}`;
          const saved = localStorage.getItem(userWishlistKey);
          if (saved) {
            try {
              state.items = JSON.parse(saved);
            } catch (e) {
              state.items = [];
            }
          }
        }
      })
      .addCase(register.fulfilled, (state, action) => {
        const userId = action.payload?._id;
        if (userId) {
          const userWishlistKey = `wishlist_${userId}`;
          const saved = localStorage.getItem(userWishlistKey);
          if (saved) {
            try {
              state.items = JSON.parse(saved);
            } catch (e) {
              state.items = [];
            }
          }
        }
      });
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
