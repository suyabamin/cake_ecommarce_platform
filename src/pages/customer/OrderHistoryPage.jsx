import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCustomerOrders, updateOrderStatus } from '../../firebase/services';
import OrderCard from '../../components/order/OrderCard';
import ChatWindow from '../../components/chat/ChatWindow';
import { PackageCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function OrderHistoryPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatOrder, setActiveChatOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const data = await fetchCustomerOrders(currentUser.uid);
        setOrders(data);
      } catch (err) {
        console.error('Order history error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [currentUser]);

  const handleUpdateAgreedDate = async (orderId, newAgreedDate) => {
    await updateOrderStatus(orderId, 'Under Review', { agreedDeliveryDate: newAgreedDate });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, agreedDeliveryDate: newAgreedDate } : o));
    if (activeChatOrder?.id === orderId) {
      setActiveChatOrder(prev => ({ ...prev, agreedDeliveryDate: newAgreedDate }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
          <PackageCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900">My Orders & Tracking</h1>
          <p className="text-xs text-gray-500 mt-0.5">View current baking progress and negotiated delivery dates.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400 animate-pulse">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center my-8 space-y-3">
          <Clock className="w-10 h-10 text-rose-300 mx-auto" />
          <h3 className="font-serif-title font-bold text-xl text-gray-900">No Orders Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed any cake orders yet. Browse our boutique shop to taste our artisan creations!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenChat={(ord) => setActiveChatOrder(ord)}
            />
          ))}
        </div>
      )}

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
