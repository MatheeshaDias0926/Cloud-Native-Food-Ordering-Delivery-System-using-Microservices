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
      console.error("Error parsing cart from localStorage:", error);
      return { items: [], restaurant: null };
    }
  });

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

      if (
        !currentCart.restaurant ||
        currentCart.restaurant._id !== restaurant._id
      ) {
        return {
          restaurant,
          items: [{ ...item, quantity: 1 }],
        };
      }

      const existingItem = currentCart.items.find((i) => i._id === item._id);
      if (existingItem) {
        return {
          ...currentCart,
          items: currentCart.items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

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

      return {
        ...prev,
        items: prev.items.filter((item) => item._id !== itemId),
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

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
