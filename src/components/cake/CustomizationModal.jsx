import React, { useState } from 'react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { ShoppingBag, Sparkles, MessageSquare, Flame } from 'lucide-react';

export default function CustomizationModal({ cake, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [selectedSize, setSelectedSize] = useState(cake.size || '8 inches');
  const [inscription, setInscription] = useState('');
  const [candles, setCandles] = useState(0);
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const price = cake.discountPrice || cake.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(cake, quantity, {
      size: selectedSize,
      inscription,
      candles,
      specialNotes
    });
    showToast(`Added customized "${cake.name}" to cart!`, 'success', 'Cart Updated');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Customize Your Cake`} maxWidth="max-w-xl">
      <form onSubmit={handleAddToCart} className="space-y-5">
        {/* Header Preview */}
        <div className="flex gap-4 p-3 rounded-2xl bg-rose-50/70 border border-rose-100 items-center">
          <img 
            src={cake.thumbnail || cake.images?.[0]} 
            alt={cake.name}
            className="w-16 h-16 rounded-xl object-cover border border-rose-200" 
          />
          <div>
            <h4 className="font-serif-title font-bold text-gray-900 text-sm">{cake.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars rating={cake.rating || 5} size="sm" />
              <span className="text-xs font-bold text-rose-600">${price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Size / Weight Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Select Cake Size
          </label>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {['7 inches (4-6 servings)', '8 inches (6-8 servings)', '9 inches (8-10 servings)', '10 inches (12-14 servings)'].map((sz) => (
              <button
                type="button"
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`p-3 rounded-xl border text-left transition font-medium ${
                  selectedSize === sz
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold shadow-sm'
                    : 'border-gray-200 hover:border-rose-200 text-gray-700'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Text Inscription */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
            Cake Inscription / Piping Text
          </label>
          <input
            type="text"
            placeholder='e.g., "Happy 25th Birthday Sarah!"'
            maxLength={50}
            value={inscription}
            onChange={(e) => setInscription(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
          />
          <span className="text-[10px] text-gray-400 mt-1 block">Maximum 50 characters</span>
        </div>

        {/* Birthday Candles */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Complimentary Candles Count
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={99}
              value={candles}
              onChange={(e) => setCandles(parseInt(e.target.value) || 0)}
              className="w-24 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-rose-500"
            />
            <span className="text-xs text-gray-500">Free golden celebration candles included</span>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Special Bakery Requests
          </label>
          <textarea
            placeholder="Less sugar, eggless preference, allergy warnings..."
            rows={2}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-rose-100 flex items-center justify-between">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm font-bold"
            >
              -
            </button>
            <span className="px-3 py-1 text-xs font-bold text-gray-800">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm font-bold"
            >
              +
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart — ${(price * quantity).toFixed(2)}
          </button>
        </div>
      </form>
    </Modal>
  );
}
