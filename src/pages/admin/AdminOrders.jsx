import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../firebase/services';
import Badge from '../../components/common/Badge';
import ChatWindow from '../../components/chat/ChatWindow';
import { useNotification } from '../../context/NotificationContext';
import { PackageCheck, Calendar, MessageSquare, Filter, ChevronRight } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Admin orders error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"`, 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      showToast('Could not update order status.', 'error');
    }
  };

  const handleUpdateAgreedDate = async (orderId, newDate) => {
    try {
      await updateOrderStatus(orderId, 'Under Review', { agreedDeliveryDate: newDate });
      showToast(`Agreed delivery date updated to ${newDate}`, 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, agreedDeliveryDate: newDate } : o));
      if (activeChatOrder?.id === orderId) {
        setActiveChatOrder(prev => ({ ...prev, agreedDeliveryDate: newDate }));
      }
    } catch (err) {
      showToast('Failed to update delivery date.', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return (o.orderStatus || '').toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900">Manage Orders & Delivery Queue</h1>
          <p className="text-xs text-gray-500 mt-1">Approve requested delivery dates, update status, and negotiate slots.</p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-rose-100 text-xs overflow-x-auto max-w-full">
          {['all', 'Pending', 'Under Review', 'Approved', 'Preparing', 'Out for Delivery', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition capitalize whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-rose-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs text-gray-400">
            No orders found in this queue state.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="glass-card rounded-3xl p-6 border border-rose-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rose-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-title font-bold text-gray-900 text-lg">
                      Order #{order.orderNumber || order.id}
                    </span>
                    <Badge status={order.orderStatus} size="sm" />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Customer: <strong>{order.customerName}</strong> ({order.phoneNumber}) • {order.customerEmail}
                  </p>
                </div>

                {/* Status Changer Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Update Status:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-white border border-rose-200 rounded-xl py-1.5 px-3 text-xs font-bold text-rose-700 focus:outline-none focus:border-rose-500 shadow-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Preparing">Preparing (Baking)</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Delivery Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-rose-50/60 p-3 rounded-2xl">
                <div>
                  <span className="text-gray-500 block">Requested Delivery Date:</span>
                  <strong className="text-gray-900">{order.requestedDeliveryDate} ({order.preferredTime || 'Standard'})</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Agreed Date:</span>
                  <strong className="text-rose-700 font-bold">{order.agreedDeliveryDate || 'Needs Negotiation'}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">Total: ${Number(order.total || 0).toFixed(2)} ({order.paymentMethod?.toUpperCase()})</span>
                <button
                  onClick={() => setActiveChatOrder(order)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Delivery Chat</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Realtime Chat Drawer */}
      {activeChatOrder && (
        <ChatWindow
          order={activeChatOrder}
          isOpen={!!activeChatOrder}
          onClose={() => setActiveChatOrder(null)}
          onUpdateAgreedDate={handleUpdateAgreedDate}
        />
      )}

    </div>
  );
}
