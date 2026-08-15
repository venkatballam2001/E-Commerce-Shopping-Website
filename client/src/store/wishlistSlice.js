import { createSlice } from '@reduxjs/toolkit';

let wishlistFromStorage = [];
try {
  wishlistFromStorage = localStorage.getItem('wishlist')
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
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    }
  }
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
