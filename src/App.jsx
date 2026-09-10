import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import CartPage from './pages/customer/CartPage';
import { useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

function AppContent() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <AppRoutes />
      </main>

      {!isAdminRoute && <Footer />}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-rose-950/30 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsCartOpen(false)}
          />
          <CartPage isDrawer onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
