import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Overview & Charts', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users & RBAC', path: '/admin/users', icon: Users },
    { label: 'Discount Coupons', path: '/admin/coupons', icon: Ticket },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Aura Admin</h2>
              <p className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">Management Console</p>
            </div>
          </div>

          {/* Nav list */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Return Link */}
        <div className="pt-6 border-t border-slate-800 mt-6">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img src={userInfo?.avatar} alt={userInfo?.name} className="w-8 h-8 rounded-full border border-slate-700" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{userInfo?.name}</p>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase">Admin</span>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
