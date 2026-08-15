import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage';
import OrdersAdminPage from './pages/admin/OrdersAdminPage';
import UsersAdminPage from './pages/admin/UsersAdminPage';
import CouponsAdminPage from './pages/admin/CouponsAdminPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Dashboard Routes (Separated Layout) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="users" element={<UsersAdminPage />} />
            <Route path="coupons" element={<CouponsAdminPage />} />
          </Route>
        </Route>

        {/* Customer Storefront Routes */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Logged in customer protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order/:id" element={<OrderDetailsPage />} />
                  </Route>
                </Routes>
              </div>
              <Footer />
              <ToastNotification />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
