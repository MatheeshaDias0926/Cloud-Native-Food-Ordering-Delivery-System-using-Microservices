import api from "./api";

// Get all restaurants
export const getRestaurants = async () => {
  try {
    const response = await api.get("/restaurants");
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
    const response = await api.get(`/restaurants/${id}`);
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
    const response = await api.get(`/restaurants/${restaurantId}/menu`);
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
    const response = await api.get(
      `/restaurants/radius/${zipcode}/${distance}`,
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

// Create a new menu item
export const createMenuItem = async (restaurantId, menuItemData) => {
  try {
    const response = await api.post(
      `/restaurants/${restaurantId}/menu`,
      menuItemData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating menu item:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a menu item
export const updateMenuItem = async (
  restaurantId,
  menuItemId,
  menuItemData
) => {
  try {
    const response = await api.put(
      `/restaurants/${restaurantId}/menu/${menuItemId}`,
      menuItemData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating menu item:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (restaurantId, menuItemId) => {
  try {
    const response = await api.delete(
      `/restaurants/${restaurantId}/menu/${menuItemId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting menu item:",
      error.response?.data || error.message
    );
    throw error;
  }
};
