import api from "./api";

// Get all orders for the current user
export const getOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`, {});
    return response.data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};
