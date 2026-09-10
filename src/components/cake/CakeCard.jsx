import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, Heart } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import RatingStars from '../common/RatingStars';
import CustomizationModal from './CustomizationModal';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

export default function CakeCard({ cake }) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const price = cake.price;
  const discountPrice = cake.discountPrice;
  const isDiscounted = discountPrice && discountPrice < price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(cake, 1);
    showToast(`Added "${cake.name}" to your cart!`, 'success', 'Cart Updated');
  };

  return (
    <>
      <div className="group glass-card rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-100 flex flex-col h-full border border-rose-100/80">
        
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <Link to={`/cake/${cake.id}`}>
            <ImageWithFallback
              src={cake.thumbnail || cake.images?.[0]}
              alt={cake.name}
              aspectRatio="aspect-square"
              className="group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {cake.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            {isDiscounted && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md">
                SAVE ${(price - discountPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-400 hover:text-rose-500 hover:bg-white transition shadow-sm z-10"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Quick Actions Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10">
            <Link
              to={`/cake/${cake.id}`}
              className="px-3 py-1.5 rounded-full bg-white/90 text-gray-800 text-xs font-semibold hover:bg-white transition flex items-center gap-1 shadow"
            >
              <Eye className="w-3.5 h-3.5" /> Details
            </Link>
            <button
              onClick={() => setIsCustomizing(true)}
              className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition flex items-center gap-1 shadow"
            >
              Customize
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
              <span>{cake.categoryName || 'Boutique Special'}</span>
              <RatingStars rating={cake.rating || 5} size="sm" />
            </div>

            <Link to={`/cake/${cake.id}`}>
              <h3 className="font-serif-title font-bold text-gray-900 text-base group-hover:text-rose-600 transition line-clamp-1">
                {cake.name}
              </h3>
            </Link>

            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {cake.description}
            </p>
          </div>

          {/* Footer & Add to Cart */}
          <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">Starting at</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900">
                  ${(isDiscounted ? discountPrice : price).toFixed(2)}
                </span>
                {isDiscounted && (
                  <span className="text-xs text-gray-400 line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors duration-300 shadow-sm border border-rose-200"
              title="Quick Add to Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

      {/* Customization Modal */}
      {isCustomizing && (
        <CustomizationModal
          cake={cake}
          isOpen={isCustomizing}
          onClose={() => setIsCustomizing(false)}
        />
      )}
    </>
  );
}
