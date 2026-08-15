import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setFilter, setPage } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import Pagination from '../components/Pagination';
import { Search, Loader2 } from 'lucide-react';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, page, pages, totalProducts, loading, filters } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchCategories());

    const categoryParam = searchParams.get('category');
    const keywordParam = searchParams.get('keyword');
    
    if (categoryParam) {
      dispatch(setFilter({ category: categoryParam }));
    }
    if (keywordParam) {
      dispatch(setFilter({ keyword: keywordParam }));
    }

    dispatch(fetchProducts());
  }, [dispatch, searchParams, filters.category, filters.keyword, filters.minPrice, filters.maxPrice, filters.minRating, filters.sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Shop Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{products.length}</span> of{' '}
            <span className="font-bold text-slate-800">{totalProducts}</span> total results
          </p>
        </div>

        {/* Live Filter Search Input */}
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Search catalog..."
            value={filters.keyword}
            onChange={(e) => dispatch(setFilter({ keyword: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilter />
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
              <p className="text-xs font-semibold">Loading catalog items...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, clearing category filters, or loosening the price bounds.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={page}
                totalPages={pages}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
              />
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default ShopPage;
