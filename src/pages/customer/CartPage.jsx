import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Cake, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function CartPage({ isDrawer = false, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, deliveryCharge, total } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (onClose) onClose();
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const content = (
    <div className="space-y-6">
      {cartItems.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
            <Cake className="w-8 h-8" />
          </div>
          <h3 className="font-serif-title font-bold text-xl text-gray-900 mb-2">Your Bag is Empty</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
            Looks like you haven't added any handcrafted boutique cakes yet.
          </p>
          <Link
            to="/cakes"
            onClick={() => onClose && onClose()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition"
          >
            Explore Cake Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="glass-card rounded-2xl p-4 flex gap-4 border border-rose-100">
                <ImageWithFallback
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-rose-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif-title font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-rose-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      Size: {item.options?.size || 'Standard'}
                    </p>

                    {item.options?.inscription && (
                      <p className="text-[10px] text-rose-600 italic truncate">
                        Piping: "{item.options.inscription}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-50">
                    <div className="flex items-center border border-rose-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-rose-50 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-rose-50 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-bold text-gray-900">
                      ${(item.effectivePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout */}
          <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-100 space-y-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Estimated Delivery Charge</span>
              <span className="font-semibold text-gray-900">
                {deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${deliveryCharge.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t border-rose-200 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>Grand Total</span>
              <span className="text-lg text-rose-600">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full mt-4 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition flex items-center justify-center gap-2"
            >
              <span>{currentUser ? 'Proceed to Checkout' : 'Login to Order Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Guaranteed Fresh
              </span>
              <button onClick={clearCart} className="hover:text-rose-600 underline">Clear Bag</button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isDrawer) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-rose-100 flex flex-col p-6 overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif-title font-bold text-lg text-gray-900">Shopping Bag</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-rose-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="font-serif-title font-bold text-3xl text-gray-900">Your Shopping Bag</h1>
      </div>
      {content}
    </div>
  );
}
