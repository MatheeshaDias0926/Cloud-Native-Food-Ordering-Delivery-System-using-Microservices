const axios = require("axios");

class OrderService {
  constructor() {
    this.baseURL = process.env.ORDER_SERVICE_URL;
  }

  async getOrder(orderId, token) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  async updatePaymentStatus(orderId, paymentStatus, token) {
    try {
      await axios.put(
        `${this.baseURL}/api/v1/orders/${orderId}/payment-status`,
        { paymentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw new Error(
        `Failed to update order payment status: ${error.message}`
      );
    }
  }
}

module.exports = new OrderService();
