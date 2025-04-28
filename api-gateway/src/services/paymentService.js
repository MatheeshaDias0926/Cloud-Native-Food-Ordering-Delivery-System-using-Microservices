const axios = require("axios");

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:5004";

const paymentService = {
  async processPayment(paymentData) {
    try {
      const response = await axios.post(
        `${PAYMENT_SERVICE_URL}/api/v1/payments`,
        paymentData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getPaymentStatus(paymentId) {
    try {
      const response = await axios.get(
        `${PAYMENT_SERVICE_URL}/api/v1/payments/${paymentId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

module.exports = paymentService;
