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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => axios.post("/auth/login", credentials);
export const getMe = () => axios.get("/auth/me");

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
