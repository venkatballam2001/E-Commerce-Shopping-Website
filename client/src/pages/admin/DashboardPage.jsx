import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats } from '../../store/adminSlice';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, TrendingUp, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs font-bold text-slate-400">Loading admin analytics dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      trend: '+18.4% vs last month',
    },
    {
      title: 'Total Customer Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-indigo-500 to-purple-600',
      trend: '+12.1% vs last month',
    },
    {
      title: 'Products in Catalog',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-sky-500 to-blue-600',
      trend: 'Active Inventory',
    },
    {
      title: 'Registered Customers',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-amber-500 to-orange-600',
      trend: '+8 new this week',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Executive Sales Analytics</h1>
        <p className="text-xs text-slate-400">Real-time performance metrics and order fulfillment overview</p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{card.value}</p>
              <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Revenue Area Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Sales Growth</h3>
              <p className="text-[11px] text-slate-400">Revenue breakdown in USD</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlySales}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Bar Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Order Status Pipeline</h3>
            <p className="text-[11px] text-slate-400">Fulfillment lifecycle breakdown</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { status: 'Pending', count: stats.statusBreakdown.pending },
                  { status: 'Processing', count: stats.statusBreakdown.processing },
                  { status: 'Shipped', count: stats.statusBreakdown.shipped },
                  { status: 'Delivered', count: stats.statusBreakdown.delivered },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Recent Customer Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-xl">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-indigo-400">#{order._id.substring(0, 8)}...</td>
                  <td className="p-3 font-semibold">{order.user?.name || 'Customer'}</td>
                  <td className="p-3 font-extrabold text-white">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-sky-500/20 text-sky-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
