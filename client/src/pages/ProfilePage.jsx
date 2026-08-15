import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, addAddress, removeAddress } from '../store/authSlice';
import { fetchMyOrders } from '../store/orderSlice';
import { User, MapPin, Package, Plus, Trash2, CheckCircle, Clock, Truck, Eye, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, successMessage, error: authError } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses'

  // Profile Form state
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');

  // Address Form state
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email, password: password || undefined, avatar }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (street && city && state && postalCode) {
      dispatch(addAddress({ street, city, state, postalCode, country, isDefault: false }));
      setShowAddrModal(false);
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border border-slate-800 shadow-xl">
        <img
          src={userInfo?.avatar}
          alt={userInfo?.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500/30 shadow-lg"
        />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center space-x-2 justify-center sm:justify-start">
            <h1 className="text-2xl font-extrabold">{userInfo?.name}</h1>
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/30">
              {userInfo?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400">{userInfo?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'addresses'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({userInfo?.addresses?.length || 0})</span>
        </button>
      </div>

      {/* Tab Content 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you complete checkout for an order, you can track real-time fulfillment updates right here.
              </p>
              <Link to="/shop" className="inline-block bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl">
                Start Shopping
              </Link>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Reference</span>
                    <h3 className="text-sm font-extrabold text-slate-900 font-mono">#{order._id}</h3>
                    <p className="text-[11px] text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-sky-50 text-sky-600 border border-sky-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {order.orderStatus}
                    </span>

                    <Link
                      to={`/order/${order._id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-wrap gap-3">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="text-xs">
                        <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-slate-400">{item.quantity}x ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Total Paid Amount:</span>
                  <span className="text-sm font-black text-indigo-600">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 2: Profile Update */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Update Profile Information
          </h3>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 3: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Manage Shipping Addresses</h3>
            <button
              onClick={() => setShowAddrModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userInfo?.addresses?.map((addr) => (
              <div key={addr._id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{addr.street}</span>
                  <button
                    onClick={() => dispatch(removeAddress(addr._id))}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-xs text-slate-400 font-semibold">{addr.country}</p>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddrModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
                <h3 className="text-base font-bold text-slate-900">Add Shipping Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Street Address"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State / Region"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Postal / Zip Code"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddrModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ProfilePage;
