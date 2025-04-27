import api from "./api";

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error(
      "Error getting current user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
