import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Calendar, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, listenToOrderMessages } from '../../firebase/services';

export default function ChatWindow({ order, isOpen, onClose, onUpdateAgreedDate }) {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [newDateInput, setNewDateInput] = useState(order?.agreedDeliveryDate || order?.requestedDeliveryDate || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!order?.id) return;
    const unsubscribe = listenToOrderMessages(order.id, (msgs) => {
      setMessages(msgs);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [order?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !order) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const senderName = userProfile?.displayName || (isAdmin ? 'Boutique Baker' : 'Customer');
    const senderRole = isAdmin ? 'admin' : 'customer';

    await sendMessage({
      orderId: order.id,
      senderId: currentUser?.uid || (isAdmin ? 'demo-admin-id' : 'demo-customer-id'),
      senderName,
      senderRole,
      receiverId: isAdmin ? order.customerId : 'admin',
      messageText: inputText.trim()
    });

    setInputText('');
  };

  const handleProposeDate = async () => {
    if (!newDateInput) return;
    const senderName = userProfile?.displayName || (isAdmin ? 'Boutique Baker' : 'Customer');
    const roleText = isAdmin ? 'Admin Proposed Date' : 'Customer Proposed Date';
    
    const msg = `📅 ${roleText}: Agreed delivery date suggested for ${newDateInput}`;
    
    await sendMessage({
      orderId: order.id,
      senderId: currentUser?.uid || (isAdmin ? 'demo-admin-id' : 'demo-customer-id'),
      senderName,
      senderRole: isAdmin ? 'admin' : 'customer',
      receiverId: isAdmin ? order.customerId : 'admin',
      messageText: msg
    });

    if (onUpdateAgreedDate) {
      await onUpdateAgreedDate(order.id, newDateInput);
    }
    setShowDatePicker(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-rose-100 flex flex-col animate-slide-up">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {isAdmin ? <Shield className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h4 className="font-bold text-sm">Delivery Chat — Order #{order.orderNumber || order.id}</h4>
            <p className="text-[11px] text-rose-100">
              Customer: {order.customerName} • Status: {order.orderStatus}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Agreed Date Banner & Negotiation Actions */}
      <div className="bg-rose-50 p-3 border-b border-rose-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-rose-900 font-semibold">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Agreed Date: <strong>{order.agreedDeliveryDate || order.requestedDeliveryDate}</strong></span>
          </div>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200"
          >
            {showDatePicker ? 'Cancel' : 'Change Agreed Date'}
          </button>
        </div>

        {showDatePicker && (
          <div className="mt-2 p-3 bg-white rounded-xl border border-rose-200 flex items-center gap-2 animate-fade-in">
            <input
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="bg-rose-50 border border-rose-200 rounded-lg p-1.5 text-xs flex-1"
            />
            <button
              onClick={handleProposeDate}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
            >
              Update Date
            </button>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fff9fa]">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            <Sparkles className="w-8 h-8 text-rose-300 mx-auto mb-2" />
            <p>No messages yet. Send a message to discuss delivery date or cake customization!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === (currentUser?.uid || (isAdmin ? 'demo-admin-id' : 'demo-customer-id'));
            const isSystemDateMsg = msg.messageText.includes('Agreed delivery date');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-gray-400 mb-0.5 px-1">
                  {msg.senderName} ({msg.senderRole})
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isSystemDateMsg
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-medium'
                      : isMe
                      ? 'bg-rose-600 text-white rounded-br-none shadow'
                      : 'bg-white text-gray-800 border border-rose-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.messageText}
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-rose-100 bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type message or delivery query..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-rose-50 border border-rose-200 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-rose-500"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
