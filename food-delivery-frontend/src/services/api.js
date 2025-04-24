import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
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

// Response interceptor
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

// Add login and register methods to the api object
api.login = (credentials) => api.post("/auth/login", credentials);
api.register = (userData) => api.post("/auth/register", userData);
api.getCurrentUser = () => api.get("/auth/me");

// User APIs
api.updateUserDetails = (userData) => api.put("/auth/updatedetails", userData);
api.updatePassword = (passwordData) =>
  api.put("/auth/updatepassword", passwordData);

// Restaurant APIs
api.getRestaurants = () => api.get("/restaurants");
api.getRestaurantById = (id) => api.get(`/restaurants/${id}`);
api.getMenuItems = (restaurantId) =>
  api.get(`/restaurants/${restaurantId}/menu`);
api.getRestaurantsInRadius = (zipcode, distance) =>
  api.get(`/restaurants/radius/${zipcode}/${distance}`);

// Order APIs
api.getOrders = () => api.get("/orders");
api.getOrderById = (orderId) => api.get(`/orders/${orderId}`);
api.createOrder = (orderData) => api.post("/orders", orderData);
api.updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, { status });
api.cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`);

// Delivery APIs
api.getDeliveries = () => api.get("/deliveries");
api.getDeliveryById = (id) => api.get(`/deliveries/${id}`);
api.updateDeliveryStatus = (id, status) =>
  api.put(`/deliveries/${id}/status`, { status });

// Payment APIs
api.processPayment = (paymentData) => api.post("/payments", paymentData);
api.getPaymentHistory = () => api.get("/payments");

export default api;
