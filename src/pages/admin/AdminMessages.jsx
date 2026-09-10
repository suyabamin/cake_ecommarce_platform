import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../firebase/services';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export default function AdminMessages() {
  const [orders, setOrders] = useState([]);
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allOrders = await fetchAllOrders();
        setOrders(allOrders);
        if (allOrders.length > 0) setActiveChatOrder(allOrders[0]);
      } catch (err) {
        console.error('Admin messages error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdateAgreedDate = async (orderId, newDate) => {
    await updateOrderStatus(orderId, 'Under Review', { agreedDeliveryDate: newDate });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, agreedDeliveryDate: newDate } : o));
    if (activeChatOrder?.id === orderId) {
      setActiveChatOrder(prev => ({ ...prev, agreedDeliveryDate: newDate }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-title font-bold text-3xl text-gray-900">Admin Support & Date Negotiation Desk</h1>
        <p className="text-xs text-gray-500 mt-1">Review delivery dates requested by customers and propose agreed slots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        <div className="space-y-3">
          <h3 className="font-serif-title font-bold text-sm text-gray-900 mb-2">Order Queue Conversations</h3>
          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setActiveChatOrder(ord)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                activeChatOrder?.id === ord.id
                  ? 'border-rose-600 bg-rose-50 shadow-sm'
                  : 'border-rose-100 bg-white hover:bg-rose-50/50'
              }`}
            >
              <div>
                <h4 className="font-bold text-xs text-gray-900">Order #{ord.orderNumber || ord.id}</h4>
                <p className="text-[11px] text-gray-500">{ord.customerName} • {ord.requestedDeliveryDate}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-500" />
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {activeChatOrder ? (
            <div className="glass-card rounded-3xl p-4 border border-rose-200 shadow-xl relative min-h-[500px]">
              <ChatWindow
                order={activeChatOrder}
                isOpen={true}
                onClose={() => {}}
                onUpdateAgreedDate={handleUpdateAgreedDate}
              />
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-gray-400">Select an order on the left</div>
          )}
        </div>

      </div>
    </div>
  );
}
