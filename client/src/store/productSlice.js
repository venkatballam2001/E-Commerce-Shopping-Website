import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fallbackCategories = [
  {
    _id: 'cat_1',
    name: 'Electronics & Audio',
    slug: 'electronics-audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'High fidelity audio gear, noise cancelling headphones, and modern gadgets.',
    productCount: 3
  },
  {
    _id: 'cat_2',
    name: 'Smart Watches & Wearables',
    slug: 'smart-watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Track fitness, monitor health metrics, and stay connected on the go.',
    productCount: 2
  },
  {
    _id: 'cat_3',
    name: 'Fashion & Footwear',
    slug: 'fashion-footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: 'Premium sneakers, urban outerwear, and timeless style essentials.',
    productCount: 2
  },
  {
    _id: 'cat_4',
    name: 'Home & Workspace',
    slug: 'home-workspace',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: 'Ergonomic accessories, ambient lighting, and sleek desk setups.',
    productCount: 2
  }
];

const fallbackProducts = [
  {
    _id: 'prod_1',
    name: 'AeroSound Pro Wireless ANC Headphones',
    description: 'Immerse yourself in crystal clear audio with 40mm titanium drivers and active noise cancellation up to -38dB. Built for 40 hours of continuous playback with quick charging.',
    price: 199.99,
    originalPrice: 249.99,
    category: { _id: 'cat_1', name: 'Electronics & Audio', slug: 'electronics-audio' },
    brand: 'AeroSound',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 14,
    isFeatured: true,
    specifications: [
      { key: 'Battery Life', value: '40 Hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.3' }
    ]
  },
  {
    _id: 'prod_2',
    name: 'Chronos Ultra Smartwatch Titanium Edition',
    description: 'Featuring an ultra-bright 2000 nits Sapphire AMOLED display, dual-frequency GPS tracking, heart rate variability metrics, and 100m water resistance.',
    price: 299.99,
    originalPrice: 349.99,
    category: { _id: 'cat_2', name: 'Smart Watches & Wearables', slug: 'smart-watches' },
    brand: 'Chronos',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    rating: 4.9,
    numReviews: 28,
    isFeatured: true,
    specifications: [
      { key: 'Display', value: '1.43" AMOLED' },
      { key: 'Water Resistance', value: '10 ATM' }
    ]
  },
  {
    _id: 'prod_3',
    name: 'Vortex Runner Pro Nitro Sneakers',
    description: 'Engineered for responsive energy return with nitrogen-infused foam midsoles and breathable engineered mesh uppers for peak marathon performance.',
    price: 139.99,
    originalPrice: 169.99,
    category: { _id: 'cat_3', name: 'Fashion & Footwear', slug: 'fashion-footwear' },
    brand: 'Vortex Athletics',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    rating: 4.7,
    numReviews: 19,
    isFeatured: true,
    specifications: [
      { key: 'Midsole', value: 'Nitro Foam' }
    ]
  },
  {
    _id: 'prod_4',
    name: 'Minimalist Walnut Studio Desk Monitor Stand',
    description: 'Handcrafted solid American walnut monitor riser designed to maximize desk space while promoting posture ergonomics with built-in cable management channels.',
    price: 89.99,
    originalPrice: 109.99,
    category: { _id: 'cat_4', name: 'Home & Workspace', slug: 'home-workspace' },
    brand: 'Craft & Wood',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    rating: 4.9,
    numReviews: 9,
    isFeatured: true,
    specifications: [
      { key: 'Material', value: 'Solid American Walnut' }
    ]
  }
];

const initialState = {
  products: fallbackProducts,
  featuredProducts: fallbackProducts,
  productDetail: fallbackProducts[0],
  categories: fallbackCategories,
  reviews: [
    {
      _id: 'rev_1',
      name: 'Sarah M.',
      rating: 5,
      comment: 'Exceptional audio quality and fast dispatch! Highly recommended.',
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString()
    }
  ],
  page: 1,
  pages: 1,
  totalProducts: 4,
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
      state.page = 1;
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
        if (Array.isArray(action.payload?.products) && action.payload.products.length > 0) {
          state.products = action.payload.products;
          state.pages = action.payload.pages || 1;
          state.totalProducts = action.payload.totalProducts || action.payload.products.length;
        }
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        // Keep initial fallback products on network rejection
      })
      // Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.featuredProducts = action.payload;
        }
      })
      // Detail
      .addCase(fetchProductById.pending, (state) => { state.detailLoading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        if (action.payload && action.payload._id) {
          state.productDetail = action.payload;
        }
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.detailLoading = false;
      })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.categories = action.payload;
        }
      })
      // Reviews
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.reviews = action.payload;
        }
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload.review);
      });
  }
});

export const { setFilter, resetFilters, setPage } = productSlice.actions;
export default productSlice.reducer;
