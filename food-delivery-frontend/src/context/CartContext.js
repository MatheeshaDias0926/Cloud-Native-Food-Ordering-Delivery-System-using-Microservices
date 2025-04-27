import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    const savedRestaurantId = localStorage.getItem("restaurantId");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
    if (restaurantId) {
      localStorage.setItem("restaurantId", restaurantId);
    }
  }, [cart, restaurantId]);

  const addToCart = (item, newRestaurantId) => {
    setCart((prevCart) => {
      // If adding from a different restaurant, clear the cart
      if (newRestaurantId !== restaurantId) {
        setRestaurantId(newRestaurantId);
        return [item];
      }

      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      }

      // Add new item
      return [...prevCart, item];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("restaurantId");
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
