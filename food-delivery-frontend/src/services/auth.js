import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth";

// Configure axios defaults
// axios.defaults.withCredentials = true;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      role,
      ...(role === "restaurant" && {
        restaurantName: "My Restaurant",
        cuisineType: "General",
      }),
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Get user error:", error.response?.data || error.message);
    throw error;
  }
};
