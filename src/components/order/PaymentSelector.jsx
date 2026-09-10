import React from 'react';
import { Banknote, Smartphone, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PaymentSelector({ paymentMethod, onSelectPayment }) {
  const methods = [
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      desc: 'Pay cash directly upon doorstep delivery',
      icon: Banknote,
      available: true
    },
    {
      id: 'bkash',
      name: 'bKash / Mobile Wallet',
      desc: 'Direct payment via bKash QR / Merchant (Offline test mode)',
      icon: Smartphone,
      available: true
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      desc: 'Visa, MasterCard & Online Gateway (Requires live credentials)',
      icon: CreditCard,
      available: false
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
        Select Payment Method *
      </label>

      <div className="space-y-2">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => method.available && onSelectPayment(method.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-rose-600 bg-rose-50/90 shadow-sm'
                  : method.available
                  ? 'border-gray-200 hover:border-rose-200 bg-white'
                  : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    {method.name}
                    {!method.available && (
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                        Gateway Offline
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-gray-500">{method.desc}</p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>100% Secure Checkout & Price Transparency — No Hidden Charges</span>
      </div>
    </div>
  );
}
