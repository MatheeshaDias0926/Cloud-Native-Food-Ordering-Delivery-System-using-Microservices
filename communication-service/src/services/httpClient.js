const axios = require("axios");
const CircuitBreaker = require("opossum");
const NodeCache = require("node-cache");
const { logger } = require("../utils/logger");

// Initialize cache with 10 minutes TTL
const cache = new NodeCache({ stdTTL: 600 });

class HttpClient {
  constructor(serviceUrl) {
    this.serviceUrl = serviceUrl;
    this.client = axios.create({
      baseURL: serviceUrl,
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${process.env.INTER_SERVICE_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    // Add circuit breaker
    this.breaker = new CircuitBreaker(this.client.request.bind(this.client), {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    });

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error(`HTTP request failed: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint, useCache = false) {
    const cacheKey = `${this.serviceUrl}${endpoint}`;

    if (useCache) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await this.breaker.fire({
        method: "GET",
        url: endpoint,
      });

      if (useCache) {
        cache.set(cacheKey, response.data);
      }

      return response.data;
    } catch (error) {
      logger.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.breaker.fire({
        method: "POST",
        url: endpoint,
        data,
      });
      return response.data;
    } catch (error) {
      logger.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await this.breaker.fire({
        method: "PUT",
        url: endpoint,
        data,
      });
      return response.data;
    } catch (error) {
      logger.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.breaker.fire({
        method: "DELETE",
        url: endpoint,
      });
      return response.data;
    } catch (error) {
      logger.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

// Create instances for each service
const userServiceClient = new HttpClient(process.env.USER_SERVICE_URL);
const restaurantServiceClient = new HttpClient(
  process.env.RESTAURANT_SERVICE_URL
);
const deliveryServiceClient = new HttpClient(process.env.DELIVERY_SERVICE_URL);

module.exports = {
  userServiceClient,
  restaurantServiceClient,
  deliveryServiceClient,
};
