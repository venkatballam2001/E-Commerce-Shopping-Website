import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { createProductReview, getProductReviews } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createProductReview);

// Image Upload Endpoint for product creation/editing
router.post('/upload', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }
  const imagePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
  res.json({ images: imagePaths });
});

export default router;
