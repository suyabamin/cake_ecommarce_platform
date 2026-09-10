import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../firebase/services';
import OrderTimeline from '../../components/order/OrderTimeline';
import Badge from '../../components/common/Badge';
import ChatWindow from '../../components/chat/ChatWindow';
import { 
  ArrowLeft, Calendar, MapPin, User, Phone, MessageSquare, 
  PackageCheck, Clock, ShieldCheck 
} from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const allOrders = await fetchAllOrders();
        const found = allOrders.find(o => o.id === id || o.orderNumber === id);
        setOrder(found || null);
      } catch (err) {
        console.error('Order detail load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleUpdateAgreedDate = async (orderId, newAgreedDate) => {
    await updateOrderStatus(orderId, 'Under Review', { agreedDeliveryDate: newAgreedDate });
    setOrder(prev => prev ? { ...prev, agreedDeliveryDate: newAgreedDate } : prev);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-xs text-gray-400">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h3 className="font-serif-title font-bold text-xl text-gray-900">Order Not Found</h3>
        <Link to="/orders" className="px-6 py-2 bg-rose-600 text-white rounded-full text-xs font-bold inline-block">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-rose-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-title font-bold text-2xl text-gray-900">
              Order #{order.orderNumber || order.id}
            </h1>
            <Badge status={order.orderStatus} size="md" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Submitted on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-200 hover:bg-rose-700 transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Delivery Consultation Chat</span>
        </button>
      </div>

      {/* Visual Order Timeline */}
      <div className="glass-card rounded-3xl p-6 border border-rose-100">
        <h3 className="font-serif-title font-bold text-base text-gray-900 mb-2">Live Order Progress</h3>
        <OrderTimeline currentStatus={order.orderStatus} />
      </div>

      {/* Delivery Dates & Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card rounded-3xl p-6 border border-rose-100 space-y-3 text-xs">
          <h4 className="font-serif-title font-bold text-sm text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-600" />
            Delivery Dates & Schedule
          </h4>

          <div className="p-3 bg-rose-50 rounded-2xl space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Requested Date:</span>
              <strong className="text-gray-900">{order.requestedDeliveryDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time Slot:</span>
              <strong className="text-gray-900">{order.preferredTime || 'Standard'}</strong>
            </div>
            <div className="flex justify-between border-t border-rose-200 pt-2 text-rose-900">
              <span className="font-semibold">Final Agreed Date:</span>
              <strong className="text-rose-700 font-bold">{order.agreedDeliveryDate || 'Pending Bakery Confirmation'}</strong>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-rose-100 space-y-3 text-xs">
          <h4 className="font-serif-title font-bold text-sm text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            Delivery Address & Recipient
          </h4>

          <div className="p-3 bg-rose-50 rounded-2xl space-y-1.5 text-gray-700">
            <p className="font-bold text-gray-900">{order.customerName}</p>
            <p>{order.deliveryAddress}</p>
            <p>{order.cityArea}</p>
            <p className="text-gray-500">Phone: {order.phoneNumber}</p>
          </div>
        </div>

      </div>

      {/* Items Breakdown */}
      <div className="glass-card rounded-3xl p-6 border border-rose-100 space-y-4">
        <h3 className="font-serif-title font-bold text-base text-gray-900">Cake Items in Order</h3>
        
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-rose-100 text-xs">
              <img src={item.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover border border-rose-100" />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-gray-900">{item.name}</h5>
                <p className="text-gray-500">Size: {item.options?.size || 'Standard'} • Qty: {item.quantity}</p>
                {item.options?.inscription && (
                  <p className="text-[11px] text-rose-600 italic">Piping: "{item.options.inscription}"</p>
                )}
              </div>
              <span className="font-bold text-gray-900 text-sm">
                ${(item.effectivePrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-rose-100 pt-4 space-y-2 text-xs text-right max-w-xs ml-auto">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>${order.deliveryCharge?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-sm pt-2 border-t border-rose-200">
            <span>Total Paid ({order.paymentMethod?.toUpperCase()})</span>
            <span className="text-rose-600">${order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Realtime Chat Drawer */}
      {isChatOpen && (
        <ChatWindow
          order={order}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onUpdateAgreedDate={handleUpdateAgreedDate}
        />
      )}

    </div>
  );
}
