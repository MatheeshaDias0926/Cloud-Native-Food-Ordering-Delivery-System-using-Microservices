import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = (email, password, userType) => {
  return api.post("/auth/login", { email, password, userType });
};

export const register = (userData) => {
  return api.post("/auth/register", userData);
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};

export const updateProfile = (userData) => {
  return api.put("/auth/profile", userData);
};

export const changePassword = (passwordData) => {
  return api.put("/auth/change-password", passwordData);
};

export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token, password) => {
  return api.post("/auth/reset-password", { token, password });
};

export const getRestaurants = () => {
  return api.get("/restaurants");
};

export const getRestaurantById = (id) => {
  return api.get(`/restaurants/${id}`);
};

export const getMenuItems = (restaurantId) => {
  return api.get(`/restaurants/${restaurantId}/menu`);
};

export const getMenuItemById = (restaurantId, menuItemId) => {
  return api.get(`/restaurants/${restaurantId}/menu-items/${menuItemId}`);
};

export const createOrder = (orderData) => {
  return api.post("/orders", orderData);
};

export const getOrders = () => {
  return api.get("/orders");
};

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const updateOrderStatus = (orderId, status) => {
  return api.patch(`/orders/${orderId}/status`, { status });
};

export default api;
