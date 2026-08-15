import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save your favorite sneakers, gadgets, and audio gear here to keep track of items you love.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900">My Saved Wishlist</h1>
        <p className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{wishlistItems.length}</span> saved item(s)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
