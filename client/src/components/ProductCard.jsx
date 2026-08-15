import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import Rating from './Rating';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);
  const isInCart = cartItems.some((item) => item.product === product._id);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      stock: product.stock,
      quantity: 1
    }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Media & Badges */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Stock Status Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-indigo-600">
              {product.brand || 'Premium'}
            </span>
            <Rating value={product.rating} numReviews={product.numReviews} />
          </div>

          <Link to={`/product/${product._id}`} className="block">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all font-bold flex items-center justify-center ${
              isInCart
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95'
            }`}
            title={isInCart ? 'In Cart' : 'Add to Cart'}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
