import React, { useState, useEffect } from 'react';
import { fetchSiteContent } from '../../firebase/services';
import { Heart, MapPin, Phone, Mail, Clock, Send, Award, Sparkles } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AboutContact() {
  const [content, setContent] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const { showToast } = useNotification();

  useEffect(() => {
    fetchSiteContent().then(setContent);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Thank you! Your message was sent to our pastry team.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Story Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
            Our Bakery Passion
          </span>
          <h1 className="font-serif-title font-bold text-4xl text-gray-900 leading-tight">
            {content?.aboutTitle || 'Welcome to Velvet & Frost'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {content?.aboutBody || 'Founded with a passion for pastry perfection, Velvet & Frost merges classic French baking techniques with modern aesthetics. Every cake is baked fresh daily using premium Madagascar vanilla, 70% dark Belgian chocolate, and pure butter.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
              <Award className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>
                <h4 className="font-serif-title font-bold text-xs text-gray-900">Master Pastry Chefs</h4>
                <p className="text-[11px] text-gray-500">French artisan techniques</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>
                <h4 className="font-serif-title font-bold text-xs text-gray-900">Zero Artificial Preservatives</h4>
                <p className="text-[11px] text-gray-500">100% natural ingredients</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-4 border border-rose-200 overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80"
            alt="Velvet & Frost Bakery"
            className="rounded-[2rem] w-full h-80 object-cover"
          />
        </div>
      </div>

      {/* Delivery & Contact Grid */}
      <div id="delivery" className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-rose-100">
        
        {/* Contact Information & Policy */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif-title font-bold text-2xl text-gray-900 mb-2">Visit Our Boutique</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Have questions about custom cake orders or wedding tastings? Contact our bakery team directly.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-rose-100 shadow-sm">
              <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Bakery Location</span>
                <span className="text-gray-600">458 Sugar Blossom Ave, Suite 100, Pastry District</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-rose-100 shadow-sm">
              <Phone className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Direct Order Phone</span>
                <span className="text-gray-600">{content?.contactPhone || '+1 (555) 234-5678'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-rose-100 shadow-sm">
              <Mail className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Email Inquiry</span>
                <span className="text-gray-600">{content?.contactEmail || 'contact@velvetfrostcakes.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Send Message Form */}
        <div className="glass-card rounded-3xl p-8 border border-rose-200 shadow-xl space-y-4">
          <h3 className="font-serif-title font-bold text-xl text-gray-900">Send Bakery Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message / Custom Request</label>
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" /> Send Inquiry
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
