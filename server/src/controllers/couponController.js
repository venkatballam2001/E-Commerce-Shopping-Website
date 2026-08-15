import Coupon from '../models/Coupon.js';

// @desc    Validate a promo coupon
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ message: 'This coupon code has expired' });
    }

    res.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      message: `Coupon applied! ${coupon.discountPercent}% discount off order.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, validUntil } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon with this code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase().trim(),
      discountPercent: Number(discountPercent),
      validUntil: new Date(validUntil),
    });

    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon deleted successfully' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
