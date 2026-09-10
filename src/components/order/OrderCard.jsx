import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { Calendar, Package, ChevronRight, MessageSquare } from 'lucide-react';

export default function OrderCard({ order, isAdminView = false, onOpenChat }) {
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="glass-card rounded-3xl p-6 border border-rose-100/90 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-bold text-gray-900 text-lg">
              Order #{order.orderNumber || order.id}
            </span>
            <Badge status={order.orderStatus} size="sm" />
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 font-medium block">Total Amount</span>
          <span className="text-lg font-bold text-rose-600">${Number(order.total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Dates Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 p-3 bg-rose-50/50 rounded-2xl text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 block">Requested Date:</span>
            <span>{order.requestedDeliveryDate} ({order.preferredTime || 'Standard'})</span>
          </div>
        </div>

        {order.agreedDeliveryDate && (
          <div className="flex items-center gap-2 text-rose-900 font-semibold bg-white p-2 rounded-xl border border-rose-200">
            <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-600 uppercase tracking-wider block font-bold">Agreed Delivery Slot:</span>
              <span>{order.agreedDeliveryDate}</span>
            </div>
          </div>
        )}
      </div>

      {/* Items Preview */}
      <div className="space-y-2 mb-4">
        {order.items?.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <img 
              src={item.thumbnail} 
              alt={item.name} 
              className="w-12 h-12 rounded-xl object-cover border border-rose-100" 
            />
            <div className="flex-1 min-w-0 text-xs">
              <h5 className="font-bold text-gray-800 truncate">{item.name}</h5>
              <p className="text-gray-500">
                Qty: {item.quantity} × ${item.effectivePrice?.toFixed(2)} {item.options?.size && `(${item.options.size})`}
              </p>
              {item.options?.inscription && (
                <span className="text-[10px] text-rose-600 italic block truncate">
                  Inscription: "{item.options.inscription}"
                </span>
              )}
            </div>
          </div>
        ))}
        {order.items?.length > 2 && (
          <p className="text-[11px] text-gray-400 font-medium pl-1">
            + {order.items.length - 2} more item(s) in this order
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
        <button
          onClick={() => onOpenChat && onOpenChat(order)}
          className="flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Delivery Consultation Chat</span>
        </button>

        <Link
          to={`/orders/${order.id}`}
          className="flex items-center gap-1 font-bold text-gray-900 hover:text-rose-600 transition"
        >
          <span>View Details & Track</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
