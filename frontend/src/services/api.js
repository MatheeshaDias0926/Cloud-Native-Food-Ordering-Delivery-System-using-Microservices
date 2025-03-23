import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/user-service/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/user-service/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  logout: async () => {
    try {
      await api.post("/user-service/auth/logout");
      localStorage.removeItem("token");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/user-service/auth/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },
};

// Restaurant API
export const restaurantAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/restaurant-service/restaurants", {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch restaurants"
      );
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/restaurant-service/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch restaurant"
      );
    }
  },

  getMenu: async (id) => {
    try {
      const response = await api.get(
        `/restaurant-service/restaurants/${id}/menu`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch menu");
    }
  },
};

// Order API
export const orderAPI = {
  create: async (orderData) => {
    try {
      const response = await api.post("/order-service/orders", orderData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  },

  getAll: async () => {
    try {
      const response = await api.get("/order-service/orders");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/order-service/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch order");
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/order-service/orders/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  },
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: async (amount) => {
    try {
      const response = await api.post("/payment-service/payment-intent", {
        amount,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create payment intent"
      );
    }
  },

  confirmPayment: async (paymentData) => {
    try {
      const response = await api.post(
        "/payment-service/confirm-payment",
        paymentData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Payment confirmation failed"
      );
    }
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async () => {
    try {
      const response = await api.get("/notification-service/notifications");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.patch(
        `/notification-service/notifications/${id}/read`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  },
};

export default api;
