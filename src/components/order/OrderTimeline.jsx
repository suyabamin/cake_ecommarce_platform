import React from 'react';
import { Check, Clock, Sparkles, Truck, Package, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { key: 'Pending', label: 'Placed', icon: Clock },
  { key: 'Under Review', label: 'Under Review', icon: Sparkles },
  { key: 'Approved', label: 'Approved', icon: Check },
  { key: 'Preparing', label: 'Baking & Decorating', icon: Package },
  { key: 'Ready for Delivery', label: 'Ready', icon: Sparkles },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

export default function OrderTimeline({ currentStatus = 'Pending' }) {
  const normalizedCurrent = (currentStatus || '').toLowerCase();
  
  // Find index of current status
  const currentIndex = STEPS.findIndex(s => s.key.toLowerCase() === normalizedCurrent);
  const activeStepIdx = currentIndex === -1 ? 0 : currentIndex;

  const isCancelled = normalizedCurrent === 'rejected' || normalizedCurrent === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center text-rose-800">
        <span className="font-bold text-sm">Order Status: {currentStatus}</span>
        <p className="text-xs text-rose-600 mt-1">This order was cancelled or rejected by bakery management.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between max-w-full overflow-x-auto pb-4">
        {/* Connection Bar */}
        <div className="absolute left-6 right-6 top-5 h-1 bg-gray-200 -z-0">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-500"
            style={{ width: `${(activeStepIdx / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= activeStepIdx;
          const isCurrent = idx === activeStepIdx;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center min-w-[70px] z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100 scale-110 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-white text-gray-400 border border-gray-300'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold mt-2 text-center max-w-[80px] leading-tight ${
                isCurrent ? 'text-rose-600 font-bold' : isCompleted ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
