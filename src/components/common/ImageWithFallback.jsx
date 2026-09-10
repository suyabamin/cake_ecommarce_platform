import React, { useState } from 'react';
import { Cake } from 'lucide-react';

export default function ImageWithFallback({ src, alt, className = '', aspectRatio = 'aspect-square' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-rose-50/50 ${aspectRatio} ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 skeleton-shimmer flex items-center justify-center">
          <Cake className="w-8 h-8 text-rose-300 animate-pulse" />
        </div>
      )}

      {error || !src ? (
        <div className="absolute inset-0 bg-rose-100/60 flex flex-col items-center justify-center p-4 text-center text-rose-400">
          <Cake className="w-10 h-10 mb-1 opacity-70" />
          <span className="text-xs font-medium">Boutique Cake</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt || 'Cake boutique product'}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
