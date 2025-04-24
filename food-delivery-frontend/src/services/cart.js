import api from "./api";

// Get cart from backend
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { items: [], restaurant: null };
  }
};

// Add item to cart
export const addToCart = async (item, restaurant) => {
  try {
    const response = await api.post("/cart/items", {
      itemId: item._id,
      restaurantId: restaurant._id,
      quantity: 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Update item quantity
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
