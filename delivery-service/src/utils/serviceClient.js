import axios from "axios";
import CircuitBreaker from "opossum";

class ServiceClient {
  constructor(serviceUrl) {
    this.serviceUrl = serviceUrl;
    this.circuitBreaker = new CircuitBreaker(this.makeRequest.bind(this), {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    });

    this.circuitBreaker.on("open", () => {
      console.log(`Circuit breaker for ${serviceUrl} is OPEN`);
    });

    this.circuitBreaker.on("halfOpen", () => {
      console.log(`Circuit breaker for ${serviceUrl} is HALF-OPEN`);
    });

    this.circuitBreaker.on("close", () => {
      console.log(`Circuit breaker for ${serviceUrl} is CLOSED`);
    });

    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  async makeRequest(config) {
    return axios({
      ...config,
      url: `${this.serviceUrl}${config.url}`,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
  }

  async request(config) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.circuitBreaker.fire(config);
        return response.data;
      } catch (error) {
        lastError = error;

        if (this.shouldRetry(error) && attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
          continue;
        }

        throw this.handleError(error);
      }
    }

    throw this.handleError(lastError);
  }

  shouldRetry(error) {
    return (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.response?.status >= 500
    );
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "Service request failed",
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        status: 503,
        message: "Service unavailable",
        data: { error: "Service did not respond" },
      };
    } else {
      return {
        status: 500,
        message: "Internal service error",
        data: { error: error.message },
      };
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create instances for different services
export const orderServiceClient = new ServiceClient(
  process.env.ORDER_SERVICE_URL
);
export const userServiceClient = new ServiceClient(
  process.env.USER_SERVICE_URL
);
