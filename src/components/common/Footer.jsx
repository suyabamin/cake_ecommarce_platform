import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Heart, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-rose-50/50 to-rose-100/70 border-t border-rose-100 pt-16 pb-8 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                <Cake className="w-5 h-5" />
              </div>
              <span className="font-serif-title text-2xl font-bold text-gray-900">
                Velvet <span className="text-rose-600">&</span> Frost
              </span>
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed">
              Crafting unforgettable sweet memories with artisanal recipes, premium Belgian chocolate, and fresh Madagascar vanilla.
            </p>
            <div className="flex items-center gap-3 text-rose-600 pt-1">
              <a href="#" className="p-2 bg-rose-100/70 hover:bg-rose-200 rounded-full transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-rose-100/70 hover:bg-rose-200 rounded-full transition"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-rose-100/70 hover:bg-rose-200 rounded-full transition"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-title font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Explore Boutique</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/cakes" className="hover:text-rose-600 transition">All Artisan Cakes</Link></li>
              <li><Link to="/categories" className="hover:text-rose-600 transition">Cake Categories</Link></li>
              <li><Link to="/cakes?featured=true" className="hover:text-rose-600 transition">Featured Specialities</Link></li>
              <li><Link to="/about" className="hover:text-rose-600 transition">Our Bakery Story</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif-title font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/orders" className="hover:text-rose-600 transition">Order Status & Tracking</Link></li>
              <li><Link to="/cart" className="hover:text-rose-600 transition">Shopping Bag</Link></li>
              <li><Link to="/about#delivery" className="hover:text-rose-600 transition">Delivery Information</Link></li>
              <li><Link to="/messages" className="hover:text-rose-600 transition">Delivery Date Consultation</Link></li>
            </ul>
          </div>

          {/* Bakery Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Visit Our Boutique</h4>
            <div className="flex items-start gap-2.5 text-xs text-gray-600">
              <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>458 Sugar Blossom Ave, Suite 100, Pastry District</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>+1 (555) 234-5678</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <Mail className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>orders@velvetfrostcakes.com</span>
            </div>
          </div>

        </div>

        <div className="border-t border-rose-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Velvet & Frost Boutique Cakes. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Baked with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for cake lovers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
