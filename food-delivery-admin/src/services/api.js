import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
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

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post("/auth/refresh-token");
        const { token } = response.data;

        // Store the new token
        localStorage.setItem("token", token);

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => axios.post("/auth/login", credentials);
export const getMe = () => axios.get("/auth/me");
export const refreshToken = () => axios.post("/auth/refresh-token");

// User Management APIs
export const getUsers = () => axios.get("/auth");
export const getUser = (id) => axios.get(`/auth/${id}`);
export const updateUser = (id, data) => axios.put(`/auth/${id}`, data);
export const deleteUser = (id) => axios.delete(`/auth/${id}`);

// Restaurant Management APIs
export const getRestaurants = () => axios.get("/restaurants");
export const getRestaurant = (id) => axios.get(`/restaurants/${id}`);
export const updateRestaurant = (id, data) =>
  axios.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => axios.delete(`/restaurants/${id}`);

// Order Management APIs
export const getOrders = () => axios.get("/orders");
export const getOrder = (id) => axios.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  axios.put(`/orders/${id}/status`, { status });

// Delivery Management APIs
export const getDeliveries = () => axios.get("/deliveries");
export const getDelivery = (id) => axios.get(`/deliveries/${id}`);
export const updateDeliveryStatus = (id, status) =>
  axios.put(`/deliveries/${id}/status`, { status });

// Payment Management APIs
export const getPaymentDetails = (orderId) => axios.get(`/payments/${orderId}`);
export const processPayment = (orderId, paymentData) =>
  axios.post(`/payments/${orderId}`, paymentData);

// Menu Item Management APIs
export const getMenuItems = () => axios.get("/menu-items");
export const getRestaurantMenuItems = (restaurantId) =>
  axios.get(`/menu-items`, { params: { restaurant: restaurantId } });
export const getMenuItem = (id) => axios.get(`/menu-items/${id}`);
export const createMenuItem = (data) => axios.post("/menu-items", data);
export const updateMenuItem = (id, data) =>
  axios.put(`/menu-items/${id}`, data);
export const deleteMenuItem = (id) => axios.delete(`/menu-items/${id}`);

// Restaurant Menu Management APIs
export const createRestaurantMenuItem = (restaurantId, data) =>
  axios.post(`/restaurants/${restaurantId}/menu`, data);
export const updateRestaurantMenuItem = (restaurantId, itemId, data) =>
  axios.put(`/restaurants/${restaurantId}/menu/${itemId}`, data);
export const deleteRestaurantMenuItem = (restaurantId, itemId) =>
  axios.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
