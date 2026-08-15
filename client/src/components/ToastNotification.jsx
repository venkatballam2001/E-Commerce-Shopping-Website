import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../store/cartSlice';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ToastNotification = () => {
  const dispatch = useDispatch();
  const { toastMessage, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (toastMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, error, dispatch]);

  if (!toastMessage && !error) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold ${
        error 
          ? 'bg-rose-900 text-rose-100 border-rose-700' 
          : 'bg-slate-900 text-white border-slate-700'
      }`}>
        {error ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span>{error || toastMessage}</span>
        <button
          onClick={() => dispatch(clearToast())}
          className="text-slate-400 hover:text-white p-1 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
