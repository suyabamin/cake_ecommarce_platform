import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, maxStars = 5, size = 'sm', interactive = false, onChange }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size] || 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalf = !isFilled && starValue - 0.5 <= rating;

        return (
          <button
            key={index}
            type={interactive ? 'button' : 'button'}
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`transition ${interactive ? 'hover:scale-115 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses} ${
                isFilled || isHalf 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'fill-transparent text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
