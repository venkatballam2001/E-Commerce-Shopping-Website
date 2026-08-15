import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCouponsAdmin, createCouponAdmin, deleteCouponAdmin } from '../../store/adminSlice';
import { Plus, Ticket, Trash2, X, Tag } from 'lucide-react';

const CouponsAdminPage = () => {
  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.admin);

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    dispatch(fetchCouponsAdmin());
  }, [dispatch]);

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (code && discountPercent && validUntil) {
      dispatch(createCouponAdmin({ code, discountPercent, validUntil }));
      setShowModal(false);
      setCode('');
      setDiscountPercent('15');
      setValidUntil('');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Discount & Promo Code Manager</h1>
          <p className="text-xs text-slate-400">Configure percentage-off promotional vouchers for checkout</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white tracking-wider uppercase font-mono">{c.code}</h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-2.5 py-1 rounded-full">
                {c.discountPercent}% OFF
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>Valid Until: <strong className="text-slate-200">{new Date(c.validUntil).toLocaleDateString()}</strong></p>
              <p>Status: <span className="text-emerald-400 font-bold">Active</span></p>
            </div>

            <div className="pt-3 border-t border-slate-900 flex justify-end">
              <button
                onClick={() => dispatch(deleteCouponAdmin(c._id))}
                className="text-slate-500 hover:text-rose-400 p-2 text-xs font-bold flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">Create Promo Code</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 uppercase font-mono text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Create Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CouponsAdminPage;
