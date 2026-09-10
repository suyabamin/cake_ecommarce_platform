import React from 'react';

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 space-y-3 animate-pulse">
          <div className="w-full aspect-square rounded-xl bg-rose-100/70 skeleton-shimmer" />
          <div className="h-4 bg-rose-100 rounded w-3/4 skeleton-shimmer" />
          <div className="h-3 bg-rose-100 rounded w-1/2 skeleton-shimmer" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-rose-200 rounded w-1/3 skeleton-shimmer" />
            <div className="h-9 w-24 bg-rose-300 rounded-full skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
