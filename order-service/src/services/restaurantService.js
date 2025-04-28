const axios = require("axios");

class RestaurantService {
  constructor() {
    this.baseURL = process.env.RESTAURANT_SERVICE_URL;
  }

  async getRestaurant(restaurantId, token) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/restaurants/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch restaurant: ${error.message}`);
    }
  }

  async getMenuItem(restaurantId, menuItemId, token) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/restaurants/${restaurantId}/menu/${menuItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch menu item: ${error.message}`);
    }
  }

  async notifyNewOrder(orderId, restaurantId, token) {
    try {
      await axios.post(
        `${this.baseURL}/api/v1/restaurants/${restaurantId}/orders`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw new Error(
        `Failed to notify restaurant about new order: ${error.message}`
      );
    }
  }
}

module.exports = new RestaurantService();
