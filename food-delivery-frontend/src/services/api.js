import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor
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

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Restaurant API
export const restaurants = {
  getRestaurants: async () => {
    const response = await api.get("/restaurants");
    return response.data;
  },
  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },
  getMenuItems: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}/menu`);
    return response.data;
  },
  createRestaurant: async (restaurantData) => {
    const response = await api.post("/restaurants", restaurantData);
    return response.data;
  },
  updateRestaurant: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },
};

// Order API
export const orders = {
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
  getUserOrders: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },
};

// User API
export const users = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },
  updatePassword: async (passwordData) => {
    const response = await api.put("/users/password", passwordData);
    return response.data;
  },
};

// Delivery APIs
api.getDeliveries = () => api.get("/deliveries");
api.getDeliveryById = (id) => api.get(`/deliveries/${id}`);
api.updateDeliveryStatus = (id, status) =>
  api.put(`/deliveries/${id}/status`, { status });

// Payment APIs
api.processPayment = (paymentData) => api.post("/payments", paymentData);
api.getPaymentHistory = () => api.get("/payments");

export default api;
