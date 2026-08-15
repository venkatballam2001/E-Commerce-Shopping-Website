import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchCategories } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, Zap, Award } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, categories, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-900 to-slate-950 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Next-Gen Premium Collection 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">Lifestyle</span> Essentials.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Curated precision audio, ultra-responsive smart wearables, engineered sneakers, and workspace acoustics designed for seamless performance.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center space-x-2 hover:translate-x-0.5"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/shop?category=electronics-audio"
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-8 py-4 rounded-2xl font-bold text-sm transition-all"
              >
                Audio & Gadgets
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-6 text-slate-400">
              <div>
                <p className="text-2xl font-extrabold text-white">4.9/5</p>
                <p className="text-xs font-semibold">User Rating</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs font-semibold">Authentic Gear</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">24h</p>
                <p className="text-xs font-semibold">Fast Dispatch</p>
              </div>
            </div>
          </div>

          {/* Hero Media Showcase */}
          <div className="relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
                alt="AeroSound Pro Headphones"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Featured Spotlight</span>
                  <h4 className="text-sm font-bold text-white">AeroSound Pro Wireless ANC</h4>
                </div>
                <span className="text-base font-extrabold text-white">$199.99</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Categories</h2>
            <p className="text-xs text-slate-500">Find products tailored to your exact active needs</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md">
                  {cat.productCount || 0} Products
                </span>
                <h3 className="text-base font-bold mt-1 text-white group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Trending Picks</h2>
            <p className="text-xs text-slate-500">Top customer-rated items this season</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1">
            <span>Shop Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200/70 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Exclusive Offer
            </span>
            <h2 className="text-3xl font-extrabold leading-tight">Get 10% Off Your First Order</h2>
            <p className="text-indigo-200 text-sm">
              Use promo code <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">WELCOME10</span> at checkout to claim your welcome discount today.
            </p>
          </div>
          <Link
            to="/shop"
            className="bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
          >
            Claim Discount Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
