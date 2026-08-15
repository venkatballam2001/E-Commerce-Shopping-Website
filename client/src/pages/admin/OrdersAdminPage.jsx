import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrdersAdmin, updateOrderStatusAdmin } from '../../store/orderSlice';
import { Link } from 'react-router-dom';
import { Eye, QrCode } from 'lucide-react';

const OrdersAdminPage = () => {
  const dispatch = useDispatch();
  const { adminOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrdersAdmin());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatusAdmin({ orderId, status: newStatus }));
  };

  return (
    <div className="space-y-6">
      
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white">Orders & PhonePe Payment Verification</h1>
        <p className="text-xs text-slate-400">Verify customer UTR transaction numbers and update shipping fulfillment status</p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Order ID & Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Payment Method / UTR</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Fulfillment Status</th>
              <th className="p-4 text-right">View Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {adminOrders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-4">
                  <p className="font-mono font-bold text-indigo-400">#{order._id}</p>
                  <p className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-white">{order.user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500">{order.user?.email}</p>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center">
                      <QrCode className="w-3 h-3 mr-1 text-indigo-400" />
                      {order.paymentMethod || 'PhonePe QR'}
                    </span>
                    {order.paymentResult?.utrNumber && (
                      <p className="text-[11px] font-mono text-emerald-400 font-bold">
                        UTR: {order.paymentResult.utrNumber}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4 font-extrabold text-white">${order.totalAmount.toFixed(2)}</td>
                <td className="p-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      order.orderStatus === 'Delivered' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <Link
                    to={`/order/${order._id}`}
                    className="p-2 text-slate-400 hover:text-white inline-block hover:bg-slate-900 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default OrdersAdminPage;
