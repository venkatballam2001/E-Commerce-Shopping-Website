import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 9;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Search Keyword
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // Category Filter (ID or Slug)
    if (req.query.category) {
      let categoryId = req.query.category;
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        const catObj = await Category.findOne({ slug: req.query.category });
        if (catObj) categoryId = catObj._id;
      }
      query.category = categoryId;
    }

    // Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating Filter
    if (req.query.minRating) {
      query.rating = { $gte: Number(req.query.minRating) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid product ID' });
  }
};

// @desc    Fetch top featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, brand, images, stock, isFeatured, specifications } = req.body;

    const product = new Product({
      name,
      price,
      originalPrice: originalPrice || price,
      description,
      category,
      brand: brand || 'Generic',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
      stock: stock || 10,
      isFeatured: Boolean(isFeatured),
      specifications: specifications || []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, brand, images, stock, isFeatured, specifications } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      if (images) product.images = images;
      product.stock = stock !== undefined ? stock : product.stock;
      if (isFeatured !== undefined) product.isFeatured = isFeatured;
      if (specifications) product.specifications = specifications;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
