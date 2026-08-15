import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, payOrder, resetOrderState } from '../store/orderSlice';
import { clearCart, saveShippingAddress } from '../store/cartSlice';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Loader2, QrCode, Smartphone, Info } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, couponDiscount } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { createdOrder, loading } = useSelector((state) => state.order);

  // Address inputs
  const [street, setStreet] = useState(shippingAddress.street || userInfo?.addresses?.[0]?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(shippingAddress.city || userInfo?.addresses?.[0]?.city || 'Springfield');
  const [state, setState] = useState(shippingAddress.state || userInfo?.addresses?.[0]?.state || 'OR');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || userInfo?.addresses?.[0]?.postalCode || '97477');
  const [country, setCountry] = useState(shippingAddress.country || userInfo?.addresses?.[0]?.country || 'United States');

  const [paymentMethod, setPaymentMethod] = useState('PhonePe QR');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Price calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = couponDiscount > 0 ? (subtotal * (couponDiscount / 100)) : 0;
  const shippingPrice = subtotal > 99 || subtotal === 0 ? 0 : 10;
  const taxPrice = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingPrice + taxPrice);

  useEffect(() => {
    if (cartItems.length === 0 && !createdOrder) {
      navigate('/cart');
    }
  }, [cartItems, createdOrder, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setUtrError('');

    if (paymentMethod === 'PhonePe QR' && !utrNumber.trim()) {
      setUtrError('Please enter your 12-digit PhonePe / UPI UTR Transaction Reference Number after scanning and paying.');
      return;
    }

    const addressObj = { street, city, state, postalCode, country };
    dispatch(saveShippingAddress(addressObj));

    const orderData = {
      orderItems: cartItems.map(i => ({
        product: i.product,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image
      })),
      shippingAddress: addressObj,
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalAmount
    };

    const action = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(action)) {
      const order = action.payload;
      setIsProcessingPayment(true);

      setTimeout(async () => {
        await dispatch(payOrder({
          orderId: order._id,
          paymentResult: {
            id: paymentMethod === 'PhonePe QR' ? (utrNumber.trim() || `UTR-${Date.now()}`) : `PAY-${Date.now()}`,
            status: paymentMethod === 'PhonePe QR' ? 'VERIFIED_PHONEPE' : 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: userInfo.email,
            utrNumber: utrNumber.trim()
          }
        }));
        dispatch(clearCart());
        dispatch(resetOrderState());
        setIsProcessingPayment(false);
        navigate(`/order/${order._id}`);
      }, 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900">Secure Order Checkout</h1>
        <p className="text-xs text-slate-500">Provide shipping coordinates and complete payment via PhonePe QR Code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-indigo-600">
              <MapPin className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">1. Shipping Address</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-indigo-600">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">2. Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* PhonePe QR Option */}
              <label
                onClick={() => setPaymentMethod('PhonePe QR')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'PhonePe QR'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">Instant 0% Fee</span>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'PhonePe QR' ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">PhonePe QR Scanner</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay direct via PhonePe / GPay / UPI</p>
                </div>
              </label>

              {/* Stripe Option */}
              <label
                onClick={() => setPaymentMethod('Stripe')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'Stripe'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-end w-full mb-2">
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'Stripe' ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Credit / Debit Card</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard, AMEX</p>
                </div>
              </label>

              {/* Razorpay Option */}
              <label
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-end w-full mb-2">
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'Razorpay' ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Net Banking / Wallets</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Razorpay Gateway</p>
                </div>
              </label>

            </div>

            {/* Detailed PhonePe QR Scanner view */}
            {paymentMethod === 'PhonePe QR' && (
              <div className="mt-6 bg-slate-900 text-white rounded-3xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 border border-slate-800">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Scanner Image Box */}
                  <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-indigo-500 shrink-0">
                    <img
                      src="/phonepe-qr.png"
                      alt="PhonePe QR Code Scanner"
                      className="w-48 h-48 object-contain rounded-xl"
                    />
                    <div className="text-center pt-2">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-amber-400 px-2 py-0.5 rounded">
                        PhonePe Accepted Here
                      </span>
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <div className="space-y-3 flex-1 text-slate-200">
                    <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-extrabold">
                      <QrCode className="w-4 h-4 text-indigo-400" />
                      <span>Step-by-Step Payment Instructions</span>
                    </div>

                    <ol className="text-xs space-y-2 text-slate-300 list-decimal list-inside font-medium">
                      <li>Open **PhonePe**, Google Pay, Paytm, or BHIM UPI app.</li>
                      <li>Scan the **PhonePe QR Code** shown on the left.</li>
                      <li>Pay the exact order amount: <strong className="text-emerald-400 text-sm font-black">${totalAmount.toFixed(2)}</strong>.</li>
                      <li>Copy the **12-Digit UTR / Transaction Reference Number** from your payment receipt and enter it below.</li>
                    </ol>

                    <a
                      href={`upi://pay?pa=phonepe@ybl&pn=AuraStore&am=${totalAmount}&cu=INR`}
                      className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors mt-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Tap to Open PhonePe App Directly</span>
                    </a>
                  </div>

                </div>

                {/* UTR Reference Input Box */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Enter 12-Digit PhonePe UTR / Ref Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 423589104721"
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-mono font-bold tracking-wider placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {utrError && (
                    <p className="text-[11px] font-bold text-rose-400 flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {utrError}
                    </p>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Order Summary sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Review Order Breakdown
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center space-x-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-slate-400">{item.quantity}x ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span className="font-bold text-slate-800">
                  {shippingPrice === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tax (8%):</span>
                <span className="font-bold text-slate-800">${taxPrice.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Total:</span>
                <span className="text-2xl font-black text-indigo-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || isProcessingPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              {loading || isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Order & Verifying...</span>
                </>
              ) : (
                <>
                  <span>Complete ${totalAmount.toFixed(2)} Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe Encrypted PhonePe Payment</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
