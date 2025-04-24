import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all restaurants
export const getRestaurants = async () => {
  try {
    const response = await axios.get(`${API_URL}/restaurants`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single restaurant by ID
export const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching restaurant:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get menu items for a restaurant
export const getMenuItems = async (restaurantId) => {
  try {
    const response = await axios.get(
      `${API_URL}/restaurants/${restaurantId}/menu`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching menu items:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get restaurants in radius
export const getRestaurantsInRadius = async (zipcode, distance) => {
  try {
    const response = await axios.get(
      `${API_URL}/restaurants/radius/${zipcode}/${distance}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching restaurants in radius:",
      error.response?.data || error.message
    );
    throw error;
  }
};
