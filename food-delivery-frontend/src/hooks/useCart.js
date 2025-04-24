import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return {
    cart: context.cart,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    getCartTotal: () => {
      return (
        context.cart?.items?.reduce(
          (total, item) => total + (item.price || 0) * (item.quantity || 0),
          0
        ) || 0
      );
    },
    getItemCount: () => {
      return (
        context.cart?.items?.reduce(
          (count, item) => count + (item.quantity || 0),
          0
        ) || 0
      );
    },
  };
};
