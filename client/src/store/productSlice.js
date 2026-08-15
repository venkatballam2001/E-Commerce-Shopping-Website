import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  featuredProducts: [],
  productDetail: null,
  categories: [],
  reviews: [],
  page: 1,
  pages: 1,
  totalProducts: 0,
  loading: false,
  detailLoading: false,
  reviewsLoading: false,
  error: null,
  filters: {
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sort: 'newest'
  }
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { getState, rejectWithValue }) => {
  try {
    const { product: { filters, page } } = getState();
    const params = new URLSearchParams();

    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.sort) params.append('sort', filters.sort);
    params.append('page', page);

    const { data } = await axios.get(`/api/products?${params.toString()}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load products');
  }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products/featured');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load featured products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Product not found');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/categories');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load categories');
  }
});

export const fetchProductReviews = createAsyncThunk('products/fetchReviews', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/products/${productId}/reviews`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load reviews');
  }
});

export const createReview = createAsyncThunk('products/createReview', async ({ productId, rating, comment }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.post(`/api/products/${productId}/reviews`, { rating, comment }, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to page 1 on filter change
    },
    resetFilters: (state) => {
      state.filters = {
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        sort: 'newest'
      };
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Products Catalog
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload?.products) ? action.payload.products : [];
        state.pages = action.payload?.pages || 1;
        state.totalProducts = action.payload?.totalProducts || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.products = []; })
      // Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      // Detail
      .addCase(fetchProductById.pending, (state) => { state.detailLoading = true; state.productDetail = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => { state.detailLoading = false; state.error = action.payload; })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      // Reviews
      .addCase(fetchProductReviews.pending, (state) => { state.reviewsLoading = true; })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload.review);
      });
  }
});

export const { setFilter, resetFilters, setPage } = productSlice.actions;
export default productSlice.reducer;
