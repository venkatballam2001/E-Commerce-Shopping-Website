import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, CreditCard, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Worldwide Express</h4>
              <p className="text-xs text-slate-400">On all orders above $99</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2-Year Global Warranty</h4>
              <p className="text-xs text-slate-400">Authentic certified products</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">30-day money back guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure Encrypted Payment</h4>
              <p className="text-xs text-slate-400">Stripe & 256-bit SSL protection</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">AuraStore</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover high-performance electronics, urban footwear, ergonomically crafted workspace accessories, and smart wearables tailored for modern lifestyles.
            </p>
            
            <div className="pt-2">
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email for 15% off..."
                  className="bg-slate-800 text-white placeholder-slate-500 text-xs px-4 py-3 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700 flex-1"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-r-xl text-xs font-bold transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" /> Subscribe
                </button>
              </form>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Shop Categories</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/shop?category=electronics-audio" className="hover:text-indigo-400 transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/shop?category=smart-watches" className="hover:text-indigo-400 transition-colors">Smart Watches</Link></li>
              <li><Link to="/shop?category=fashion-footwear" className="hover:text-indigo-400 transition-colors">Fashion & Sneakers</Link></li>
              <li><Link to="/shop?category=home-workspace" className="hover:text-indigo-400 transition-colors">Home & Desk Setup</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400 transition-colors">My Saved Wishlist</Link></li>
              <li><a href="#faq" className="hover:text-indigo-400 transition-colors">Shipping & Returns FAQ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform Info</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Account Portal</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">Admin Workspace</Link></li>
              <li><span className="text-slate-500">MERN Stack Edition 2.0</span></li>
              <li><span className="text-slate-500">Node v24 + Vite + React 18</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} AuraStore Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Certifications</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
