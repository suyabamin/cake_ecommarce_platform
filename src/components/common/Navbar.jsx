import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Search, User, Menu, X, Cake, Shield, LogOut, 
  MessageSquare, PackageCheck, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { currentUser, userProfile, isAdmin, logout, loginDemoRole } = useAuth();
  const { itemTotalCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cakes?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Fresh Handcrafted Cakes Delivered Daily • Free Delivery on Orders Over $100</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform duration-300">
              <Cake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-2xl font-bold tracking-tight text-gray-900 group-hover:text-rose-600 transition-colors">
                Velvet <span className="text-rose-600">&</span> Frost
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-500 -mt-1">
                Boutique Cakes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
            <Link to="/" className="hover:text-rose-600 transition">Home</Link>
            <Link to="/cakes" className="hover:text-rose-600 transition">All Cakes</Link>
            <Link to="/categories" className="hover:text-rose-600 transition">Categories</Link>
            <Link to="/about" className="hover:text-rose-600 transition">Our Story</Link>
          </nav>

          {/* Search Bar & Action Buttons */}
          <div className="hidden lg:flex items-center relative max-w-xs w-full mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search red velvet, cheesecake..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-rose-200 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Button for instant demo testing */}
            <div className="hidden xl:flex items-center bg-rose-100/60 p-1 rounded-xl text-[11px] font-semibold">
              <button
                onClick={() => loginDemoRole('customer')}
                className={`px-2.5 py-1 rounded-lg transition ${!isAdmin && currentUser ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600 hover:text-rose-600'}`}
              >
                Customer Mode
              </button>
              <button
                onClick={() => loginDemoRole('admin')}
                className={`px-2.5 py-1 rounded-lg transition ${isAdmin ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:text-rose-600'}`}
              >
                Admin Mode
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition shadow-sm border border-rose-200 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {itemTotalCount}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-rose-200 hover:border-rose-300 transition shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-xs flex items-center justify-center">
                    {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-gray-800 pr-1 max-w-[100px] truncate">
                    {userProfile?.displayName || 'My Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-2 border-b border-rose-50">
                      <p className="text-xs font-semibold text-gray-900 truncate">{userProfile?.displayName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                        {userProfile?.role || 'customer'}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-700 font-semibold hover:bg-rose-50"
                      >
                        <Shield className="w-4 h-4 text-rose-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-rose-50"
                    >
                      <PackageCheck className="w-4 h-4 text-rose-500" />
                      My Orders & Tracking
                    </Link>

                    <Link
                      to="/messages"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-rose-50"
                    >
                      <MessageSquare className="w-4 h-4 text-rose-500" />
                      Support Messages
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-rose-50"
                    >
                      <User className="w-4 h-4 text-rose-500" />
                      My Profile
                    </Link>

                    <div className="border-t border-rose-50 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 font-medium hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-full shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-rose-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-rose-100 px-4 pt-3 pb-6 animate-slide-up shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-rose-50 border border-rose-200 rounded-xl py-2.5 pl-10 pr-4 text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="flex flex-col gap-3 font-medium text-sm text-gray-800">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50">Home</Link>
            <Link to="/cakes" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50">All Cakes</Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50">Categories</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50">Our Story</Link>

            {currentUser && (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50 text-rose-600 font-semibold">My Orders & Tracking</Link>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50">Messages</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-rose-50 text-rose-700 font-bold">Admin Dashboard</Link>
                )}
              </>
            )}
          </nav>

          <div className="mt-4 pt-4 border-t border-rose-100 flex justify-between items-center text-xs">
            <span className="text-gray-500">Quick Test Modes:</span>
            <div className="flex gap-2">
              <button onClick={() => { loginDemoRole('customer'); setMobileMenuOpen(false); }} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg font-semibold">Customer</button>
              <button onClick={() => { loginDemoRole('admin'); setMobileMenuOpen(false); }} className="px-3 py-1 bg-rose-600 text-white rounded-lg font-semibold">Admin</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
