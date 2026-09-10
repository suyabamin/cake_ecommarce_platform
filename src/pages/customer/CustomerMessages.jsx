import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCustomerOrders, updateOrderStatus } from '../../firebase/services';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export default function CustomerMessages() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!currentUser?.uid) return;
      try {
        const userOrders = await fetchCustomerOrders(currentUser.uid);
        setOrders(userOrders);
        if (userOrders.length > 0) {
          setActiveChatOrder(userOrders[0]);
        }
      } catch (err) {
        console.error('Messages load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const handleUpdateAgreedDate = async (orderId, newDate) => {
    await updateOrderStatus(orderId, 'Under Review', { agreedDeliveryDate: newDate });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, agreedDeliveryDate: newDate } : o));
    if (activeChatOrder?.id === orderId) {
      setActiveChatOrder(prev => ({ ...prev, agreedDeliveryDate: newDate }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900">Support & Delivery Messages</h1>
          <p className="text-xs text-gray-500 mt-0.5">Chat directly with our pastry chefs regarding your cake delivery dates.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading support conversations...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center my-8">
          <MessageSquare className="w-10 h-10 text-rose-300 mx-auto mb-2" />
          <h3 className="font-serif-title font-bold text-xl text-gray-900">No Active Conversations</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            Place an order to start a delivery consultation chat with our bakery team!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Order list selection */}
          <div className="space-y-3">
            <h3 className="font-serif-title font-bold text-sm text-gray-900 mb-2">Select Order Conversation</h3>
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
                  <span className="text-[11px] text-gray-500 block">{ord.requestedDeliveryDate}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </div>
            ))}
          </div>

          {/* Active Chat Window */}
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
              <div className="text-center py-20 text-xs text-gray-400">Select an order on the left to start chat</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
