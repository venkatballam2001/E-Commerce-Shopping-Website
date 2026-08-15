import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../store/orderSlice';
import { Check, Clock, Truck, Package, ShieldCheck, MapPin, CreditCard, ArrowLeft, Loader2, QrCode } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, orderDetailLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (orderDetailLoading || !currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-xs font-bold text-slate-500">Fetching order details...</p>
      </div>
    );
  }

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(currentOrder.orderStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/profile" className="text-slate-400 hover:text-slate-700">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Receipt</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            Order #{currentOrder._id}
          </h1>
          <p className="text-xs text-slate-400">Placed on {new Date(currentOrder.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center">
            <QrCode className="w-3.5 h-3.5 mr-1.5" />
            {currentOrder.paymentMethod || 'PhonePe QR'}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
            currentOrder.isPaid
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-rose-50 text-rose-600 border border-rose-200'
          }`}>
            {currentOrder.isPaid ? 'Payment Confirmed' : 'Unpaid'}
          </span>
        </div>
      </div>

      {/* Order Status Progress Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fulfillment Status Tracker</h3>
        
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 -z-0"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-50 font-extrabold'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100">
              Purchased Items
            </h3>

            <div className="space-y-4">
              {currentOrder.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                    <div>
                      <Link to={`/product/${item.product}`} className="font-bold text-slate-800 hover:text-indigo-600 line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-slate-400 font-semibold">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-600">
              <MapPin className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Delivery Address</h4>
            </div>
            <div className="text-xs text-slate-600 space-y-1 font-medium">
              <p>{currentOrder.shippingAddress.street}</p>
              <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}</p>
              <p className="font-bold text-slate-800">{currentOrder.shippingAddress.country}</p>
            </div>
          </div>

          {currentOrder.paymentResult?.utrNumber && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-2 border border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">PhonePe Payment Verified</h4>
              </div>
              <p className="text-xs text-slate-400">Submitted UTR Reference:</p>
              <p className="text-sm font-mono font-bold text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl w-fit">
                {currentOrder.paymentResult.utrNumber}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100">
              Financial Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-800">${currentOrder.itemsPrice.toFixed(2)}</span>
              </div>

              {currentOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>-${currentOrder.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee:</span>
                <span className="font-bold text-slate-800">${currentOrder.shippingPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax:</span>
                <span className="font-bold text-slate-800">${currentOrder.taxPrice.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Total Amount:</span>
                <span className="text-xl font-black text-indigo-600">${currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetailsPage;
