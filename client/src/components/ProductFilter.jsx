import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, resetFilters } from '../store/productSlice';
import { SlidersHorizontal, RotateCcw, Star } from 'lucide-react';

const ProductFilter = () => {
  const dispatch = useDispatch();
  const { categories, filters } = useSelector((state) => state.product);

  const handleCategoryChange = (catId) => {
    dispatch(setFilter({ category: filters.category === catId ? '' : catId }));
  };

  const handlePriceChange = (e) => {
    dispatch(setFilter({ [e.target.name]: e.target.value }));
  };

  const handleRatingChange = (rating) => {
    dispatch(setFilter({ minRating: filters.minRating === rating ? '' : rating }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters & Sort</h3>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Categories
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isSelected = filters.category === cat._id || filters.category === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  {cat.productCount || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handlePriceChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {[4, 3, 2].map((rating) => {
            const isSelected = String(filters.minRating) === String(rating);
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex text-amber-400">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ProductFilter;
