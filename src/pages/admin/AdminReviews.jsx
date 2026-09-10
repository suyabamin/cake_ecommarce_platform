import React, { useState, useEffect } from 'react';
import RatingStars from '../../components/common/RatingStars';
import { useNotification } from '../../context/NotificationContext';
import { Star, CheckCircle2, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      cakeName: 'Rose Gold Velvet Dream',
      customerName: 'Sophia Reynolds',
      rating: 5,
      comment: 'The Rose Gold Velvet Dream was the highlight of my birthday! The buttercream was silky and not overly sweet.',
      verifiedPurchase: true,
      createdAt: '2026-09-08'
    },
    {
      id: 'rev-2',
      cakeName: 'Midnight Belgian Truffle',
      customerName: 'Marcus Vance',
      rating: 5,
      comment: 'Best chocolate cake in town! Decadent, dark, and beautifully packaged.',
      verifiedPurchase: true,
      createdAt: '2026-09-05'
    }
  ]);
  const { showToast } = useNotification();

  const handleDeleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review removed.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-title font-bold text-3xl text-gray-900">Verified Review Moderation</h1>
        <p className="text-xs text-gray-500 mt-1">Moderate customer reviews submitted by verified purchasers.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="glass-card rounded-3xl p-6 border border-rose-100 flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-gray-900">{rev.customerName}</strong>
                <span className="text-xs text-rose-600 font-semibold">on {rev.cakeName}</span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Purchase
                </span>
              </div>
              <RatingStars rating={rev.rating} size="sm" />
              <p className="text-xs text-gray-600">{rev.comment}</p>
            </div>

            <button
              onClick={() => handleDeleteReview(rev.id)}
              className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-600 transition"
              title="Delete Review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
