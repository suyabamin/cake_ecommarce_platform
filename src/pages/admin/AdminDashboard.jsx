import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchAllOrders, fetchCakes, fetchCategories 
} from '../../firebase/services';
import Badge from '../../components/common/Badge';
import { 
  DollarSign, PackageCheck, Clock, Sparkles, Cake, 
  FolderTree, TrendingUp, ChevronRight 
} from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [cakeCount, setCakeCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [ordersData, cakesData, catData] = await Promise.all([
          fetchAllOrders(),
          fetchCakes(),
          fetchCategories()
        ]);
        setOrders(ordersData);
        setCakeCount(cakesData.length);
        setCategoryCount(catData.length);
      } catch (err) {
        console.error('Admin metrics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Under Review').length;
  const preparingCount = orders.filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Approved').length;
  const completedCount = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Completed').length;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="font-serif-title font-bold text-3xl text-gray-900">Boutique Executive Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time revenue, order queue status, and store catalog metrics.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card rounded-3xl p-6 border border-rose-100 flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Total Gross Revenue</span>
            <h3 className="font-serif-title font-bold text-2xl text-gray-900">${totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-rose-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Pending & Under Review</span>
            <h3 className="font-serif-title font-bold text-2xl text-gray-900">{pendingCount}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-rose-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Baking & Decorating</span>
            <h3 className="font-serif-title font-bold text-2xl text-gray-900">{preparingCount}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-rose-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Completed Orders</span>
            <h3 className="font-serif-title font-bold text-2xl text-gray-900">{completedCount}</h3>
          </div>
        </div>

      </div>

      {/* Catalog Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-base text-gray-900">Total Listed Cakes</h4>
              <p className="text-xs text-gray-500">{cakeCount} Active Boutique Varieties</p>
            </div>
          </div>
          <Link to="/admin/cakes" className="px-4 py-2 bg-rose-600 text-white rounded-full text-xs font-bold">
            Manage
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-base text-gray-900">Active Categories</h4>
              <p className="text-xs text-gray-500">{categoryCount} Boutique Categories</p>
            </div>
          </div>
          <Link to="/admin/categories" className="px-4 py-2 bg-rose-600 text-white rounded-full text-xs font-bold">
            Manage
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card rounded-3xl p-6 border border-rose-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-title font-bold text-lg text-gray-900">Recent Customer Orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1">
            View All Orders Queue <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-rose-100 text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-2">Order #</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Requested Date</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-rose-50/50 transition">
                  <td className="py-3 px-2 font-bold text-gray-900">#{order.orderNumber || order.id}</td>
                  <td className="py-3 px-2 text-gray-700">{order.customerName}</td>
                  <td className="py-3 px-2 text-gray-600">{order.requestedDeliveryDate}</td>
                  <td className="py-3 px-2 font-bold text-rose-600">${Number(order.total || 0).toFixed(2)}</td>
                  <td className="py-3 px-2"><Badge status={order.orderStatus} size="sm" /></td>
                  <td className="py-3 px-2 text-right">
                    <Link to="/admin/orders" className="text-rose-600 font-bold hover:underline">
                      Review & Process
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
