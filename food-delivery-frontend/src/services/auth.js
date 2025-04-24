import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, role) => {
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
};

export const getMe = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
