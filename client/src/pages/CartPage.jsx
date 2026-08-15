import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart
} from '../store/cartSlice';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Ticket,
  ShieldCheck,
  Tag,
  X
} from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, coupon, couponDiscount, loading: couponLoading, error: couponError } = useSelector(
    (state) => state.cart
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [couponInput, setCouponInput] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 99 || subtotal === 0 ? 0 : 10;
  const discountAmount = couponDiscount > 0 ? (subtotal * (couponDiscount / 100)) : 0;
  const taxPrice = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingPrice + taxPrice);

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      dispatch(applyCoupon(couponInput.trim()));
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Looks like you haven't added any items to your shopping cart yet. Explore our high-tech catalog today!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500">
            You have <span className="font-bold text-slate-800">{cartItems.length}</span> distinct item(s) in cart
          </p>
        </div>

        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item Table/List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                />
                <div>
                  <Link to={`/product/${item.product}`} className="text-xs font-bold text-slate-900 hover:text-indigo-600 line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">${item.price.toFixed(2)} each</p>
                </div>
              </div>

              {/* Quantity Adjuster */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-extrabold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-extrabold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.product))}
                  className="text-slate-400 hover:text-rose-500 p-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Sidebar */}
        <div className="space-y-6">
          
          {/* Coupon Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="flex items-center space-x-2">
              <Ticket className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Promo Code</h3>
            </div>

            {coupon ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">{coupon} (-{couponDiscount}%)</span>
                </div>
                <button
                  onClick={() => dispatch(removeCoupon())}
                  className="text-emerald-700 hover:text-rose-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({couponDiscount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping:</span>
                <span className="font-bold text-slate-800">
                  {shippingPrice === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%):</span>
                <span className="font-bold text-slate-800">${taxPrice.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Total:</span>
                <span className="text-2xl font-black text-indigo-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(userInfo ? '/checkout' : '/login?redirect=checkout')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;
