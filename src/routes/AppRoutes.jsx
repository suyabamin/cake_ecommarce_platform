import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/visitor/Home';
import CakeCatalog from '../pages/visitor/CakeCatalog';
import CategoriesPage from '../pages/visitor/CategoriesPage';
import CakeDetail from '../pages/visitor/CakeDetail';
import AboutContact from '../pages/visitor/AboutContact';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrderHistoryPage from '../pages/customer/OrderHistoryPage';
import OrderDetailPage from '../pages/customer/OrderDetailPage';
import CustomerMessages from '../pages/customer/CustomerMessages';
import ProfilePage from '../pages/customer/ProfilePage';

import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCakes from '../pages/admin/AdminCakes';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminMessages from '../pages/admin/AdminMessages';
import AdminCMS from '../pages/admin/AdminCMS';

import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, isBanned } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (isBanned) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-2xl shadow-inner">
          🚫
        </div>
        <h2 className="font-serif-title font-bold text-2xl text-gray-900">Account Suspended</h2>
        <p className="text-sm text-gray-600 max-w-md leading-relaxed">
          Your account has been temporarily suspended.<br />
          Please contact the administrator for assistance.
        </p>
      </div>
    );
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Visitor Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cakes" element={<CakeCatalog />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/cake/:id" element={<CakeDetail />} />
      <Route path="/about" element={<AboutContact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Customer Protected Routes */}
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><CustomerMessages /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="cakes" element={<AdminCakes />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="cms" element={<AdminCMS />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
