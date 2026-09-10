import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vf_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('vf_cart_items', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  }, [cartItems]);

  const addToCart = (cake, quantity = 1, options = {}) => {
    setCartItems(prev => {
      const cartItemId = `${cake.id}-${options.size || 'default'}-${options.inscription || ''}`;
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);

      const effectivePrice = cake.discountPrice || cake.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          cartItemId,
          id: cake.id,
          name: cake.name,
          thumbnail: cake.thumbnail || cake.images?.[0],
          price: cake.price,
          effectivePrice,
          quantity,
          options: {
            size: options.size || cake.size || 'Standard',
            weight: options.weight || cake.weight || '1.5 kg',
            inscription: options.inscription || '',
            candles: options.candles || 0,
            specialNotes: options.specialNotes || ''
          }
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.effectivePrice * item.quantity), 0);
  const deliveryCharge = subtotal > 100 || subtotal === 0 ? 0 : 7.00;
  const total = subtotal + deliveryCharge;
  const itemTotalCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      deliveryCharge,
      total,
      itemTotalCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
