import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export default function DeliveryDatePicker({
  requestedDate,
  onDateChange,
  preferredTime,
  onTimeChange
}) {
  // Compute minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const timeSlots = [
    'Morning (09:00 AM - 12:00 PM)',
    'Afternoon (01:00 PM - 04:00 PM)',
    'Evening (05:00 PM - 08:00 PM)'
  ];

  return (
    <div className="space-y-4 bg-rose-50/60 rounded-2xl p-5 border border-rose-100">
      <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
        <Calendar className="w-4 h-4 text-rose-600" />
        <span>Delivery Date & Time Selection</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Requested Delivery Date *
          </label>
          <input
            type="date"
            min={minDateStr}
            required
            value={requestedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-white border border-rose-200 rounded-xl py-2.5 px-3 text-xs text-gray-800 font-medium focus:outline-none focus:border-rose-500 shadow-sm"
          />
        </div>

        {/* Time Slot Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Preferred Time Slot *
          </label>
          <select
            value={preferredTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full bg-white border border-rose-200 rounded-xl py-2.5 px-3 text-xs text-gray-800 font-medium focus:outline-none focus:border-rose-500 shadow-sm"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Negotiation Policy Alert */}
      <div className="flex items-start gap-2 text-[11px] text-gray-600 bg-white/80 p-3 rounded-xl border border-rose-100">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-gray-900">Bakery Capacity Note:</strong> Your requested delivery date is reviewed by our pastry chef. If your chosen date is fully booked, our team will message you to confirm an agreed delivery slot.
        </p>
      </div>
    </div>
  );
}
