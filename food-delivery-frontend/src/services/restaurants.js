import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/restaurants";

export const getRestaurants = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const getRestaurantById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createRestaurant = async (restaurantData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, restaurantData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
