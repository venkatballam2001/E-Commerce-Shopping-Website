import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists with this email address' });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      addresses: user.addresses,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      addresses: updatedUser.addresses,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { street, city, state, postalCode, country, isDefault } = req.body;
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ street, city, state, postalCode, country, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();
    res.status(201).json(user.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Remove shipping address
// @route   DELETE /api/auth/address/:id
// @access  Private
export const removeAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// @desc    Toggle user block status (Admin only)
// @route   PUT /api/auth/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block administrator accounts' });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
