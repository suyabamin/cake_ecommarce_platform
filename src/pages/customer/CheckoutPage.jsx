import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { createOrder } from '../../firebase/services';
import DeliveryDatePicker from '../../components/order/DeliveryDatePicker';
import PaymentSelector from '../../components/order/PaymentSelector';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, User, Phone } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // Form Fields
  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(userProfile?.address || '');
  const [cityArea, setCityArea] = useState('Downtown / Central');
  const [orderNotes, setOrderNotes] = useState('');

  // Delivery Date & Payment
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState(tomorrowStr);
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="font-serif-title font-bold text-2xl text-gray-900">Your Bag is Empty</h2>
        <p className="text-xs text-gray-500">Add cakes to your bag before proceeding to checkout.</p>
        <Link to="/cakes" className="inline-block px-6 py-2.5 bg-rose-600 text-white rounded-full font-bold text-xs">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !deliveryAddress || !requestedDeliveryDate) {
      showToast('Please fill in all required delivery fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerId: currentUser?.uid || 'guest-customer-id',
        customerName,
        customerEmail: currentUser?.email || 'guest@example.com',
        phoneNumber,
        deliveryAddress,
        cityArea,
        orderNotes,
        requestedDeliveryDate,
        preferredTime,
        paymentMethod,
        items: cartItems,
        subtotal,
        deliveryCharge,
        total
      };

      const created = await createOrder(orderPayload);
      clearCart();
      showToast(`Order #${created.orderNumber} placed successfully!`, 'success', 'Order Submitted');
      navigate(`/orders/${created.id}`);
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700">
        <ArrowLeft className="w-4 h-4" /> Return to Shopping Bag
      </Link>

      <div className="flex items-center justify-between border-b border-rose-100 pb-4">
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900">Boutique Checkout</h1>
          <p className="text-xs text-gray-500 mt-1">Complete your delivery address and date preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Contact & Address Section */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100/90 space-y-4">
            <h3 className="font-serif-title font-bold text-lg text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              1. Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-rose-500"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-rose-500"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Street Delivery Address *</label>
              <textarea
                required
                rows={2}
                placeholder="House/Apartment #, Street name, Building..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City / Region Area</label>
              <select
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Downtown / Central">Downtown / Central District</option>
                <option value="North Pastry Heights">North Pastry Heights</option>
                <option value="Sugar Valley South">Sugar Valley South</option>
                <option value="West Velvet Gardens">West Velvet Gardens</option>
              </select>
            </div>
          </div>

          {/* Delivery Date Component */}
          <DeliveryDatePicker
            requestedDate={requestedDeliveryDate}
            onDateChange={setRequestedDeliveryDate}
            preferredTime={preferredTime}
            onTimeChange={setPreferredTime}
          />

          {/* Payment Method Component */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100/90 space-y-4">
            <h3 className="font-serif-title font-bold text-lg text-gray-900">
              3. Payment Selection
            </h3>
            <PaymentSelector
              paymentMethod={paymentMethod}
              onSelectPayment={setPaymentMethod}
            />
          </div>

          {/* Special Order Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Order Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Leave with building doorman, surprise gift delivery..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

        </div>

        {/* Right Col: Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-rose-200 shadow-xl space-y-4 sticky top-24">
            <h3 className="font-serif-title font-bold text-lg text-gray-900 pb-3 border-b border-rose-100">
              Order Summary ({cartItems.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-3 text-xs">
                  <img src={item.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover border border-rose-100" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-gray-800 truncate">{item.name}</h5>
                    <span className="text-[11px] text-gray-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">${(item.effectivePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-rose-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${deliveryCharge.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-rose-200 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-xl text-rose-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting Order...' : 'Place Cake Order'}</span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Safe & Secure Order Placement
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
