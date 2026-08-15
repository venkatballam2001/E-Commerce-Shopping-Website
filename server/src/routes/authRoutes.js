import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  removeAddress,
  getUsers,
  toggleBlockUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validateRequest,
  loginUser
);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/address')
  .post(protect, addAddress);

router.route('/address/:id')
  .delete(protect, removeAddress);

router.get('/users', protect, admin, getUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);

export default router;
