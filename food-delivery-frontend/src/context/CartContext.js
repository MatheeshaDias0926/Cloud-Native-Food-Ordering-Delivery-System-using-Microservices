import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart
        ? JSON.parse(savedCart)
        : { items: [], restaurant: null };
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return { items: [], restaurant: null };
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (item, restaurant) => {
    if (!item || !restaurant) {
      console.error("Invalid item or restaurant data");
      return;
    }

    setCart((prev) => {
      const currentCart = prev || { items: [], restaurant: null };

      // If adding from a different restaurant, clear the cart
      if (
        currentCart.restaurant &&
        currentCart.restaurant._id !== restaurant._id
      ) {
        return {
          restaurant,
          items: [{ ...item, quantity: 1 }],
        };
      }

      // If no restaurant set yet, set it
      if (!currentCart.restaurant) {
        return {
          restaurant,
          items: [{ ...item, quantity: 1 }],
        };
      }

      // Check if item already exists in cart
      const existingItem = currentCart.items.find((i) => i._id === item._id);
      if (existingItem) {
        return {
          ...currentCart,
          items: currentCart.items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      // Add new item
      return {
        ...currentCart,
        items: [...currentCart.items, { ...item, quantity: 1 }],
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      if (!prev || !prev.items) {
        return { items: [], restaurant: null };
      }

      const updatedItems = prev.items.filter((item) => item._id !== itemId);

      // If no items left, clear restaurant
      if (updatedItems.length === 0) {
        return { items: [], restaurant: null };
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) => {
      if (!prev || !prev.items) {
        return { items: [], restaurant: null };
      }

      return {
        ...prev,
        items: prev.items.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        ),
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], restaurant: null });
  };

  const getCartTotal = () => {
    return cart.items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
