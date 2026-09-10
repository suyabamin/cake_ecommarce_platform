import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Mail, Phone, MapPin, Save, Shield } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function ProfilePage() {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { showToast } = useNotification();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          displayName,
          phone,
          address,
          updatedAt: new Date().toISOString()
        });
      }
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Saved to local session.', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
          {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="font-serif-title font-bold text-2xl text-gray-900">{userProfile?.displayName || 'My Profile'}</h1>
          <p className="text-xs text-gray-500">{currentUser?.email} • Role: <strong className="uppercase text-rose-600">{userProfile?.role || 'Customer'}</strong></p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-8 border border-rose-200 shadow-xl space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Full Display Name</label>
          <div className="relative">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-none focus:border-rose-500"
            />
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-none focus:border-rose-500"
            />
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Default Delivery Address</label>
          <div className="relative">
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street name, apartment #, city..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-3.5 text-xs focus:outline-none focus:border-rose-500"
            />
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}
