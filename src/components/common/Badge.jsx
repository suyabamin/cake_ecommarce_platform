import React from 'react';

export default function Badge({ status, size = 'md' }) {
  const normalized = (status || '').toLowerCase();

  const styles = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    'under review': 'bg-sky-100 text-sky-800 border-sky-200',
    approved: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    preparing: 'bg-purple-100 text-purple-800 border-purple-200',
    'ready for delivery': 'bg-pink-100 text-pink-800 border-pink-200',
    'out for delivery': 'bg-blue-100 text-blue-800 border-blue-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border capitalize font-medium ${sizeClasses} ${styles[normalized] || 'bg-rose-50 text-rose-700 border-rose-200'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
}
