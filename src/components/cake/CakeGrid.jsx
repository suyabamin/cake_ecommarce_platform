import React from 'react';
import CakeCard from './CakeCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Cake } from 'lucide-react';

export default function CakeGrid({ cakes, loading }) {
  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  if (!cakes || cakes.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center my-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <Cake className="w-8 h-8" />
        </div>
        <h3 className="font-serif-title font-bold text-xl text-gray-900 mb-1">No Cakes Found</h3>
        <p className="text-xs text-gray-500 max-w-sm">
          We couldn't find any cakes matching your search criteria. Try clearing filters or adjusting your search keyword!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cakes.map((cake) => (
        <CakeCard key={cake.id} cake={cake} />
      ))}
    </div>
  );
}
