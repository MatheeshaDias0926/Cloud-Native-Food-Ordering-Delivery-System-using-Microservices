import axios from "axios";

class APIGatewayClient {
  constructor() {
    this.gatewayUrl = process.env.API_GATEWAY_URL || "http://localhost:3000";
    this.serviceName = "delivery-service";
    this.servicePort = process.env.PORT || 3005;
    this.healthCheckInterval = 30000; // 30 seconds
  }

  async registerService() {
    try {
      const response = await axios.post(
        `${this.gatewayUrl}/services/register`,
        {
          name: this.serviceName,
          url: `http://localhost:${this.servicePort}`,
          endpoints: [
            {
              path: "/api/v1/deliveries",
              methods: ["GET", "POST", "PUT", "DELETE"],
            },
            {
              path: "/health",
              methods: ["GET"],
            },
          ],
          healthCheck: `http://localhost:${this.servicePort}/health`,
        }
      );

      console.log("Service registered with API Gateway:", response.data);
      this.startHealthCheck();
    } catch (error) {
      console.error("Failed to register with API Gateway:", error.message);
      // Retry registration after delay
      setTimeout(() => this.registerService(), 5000);
    }
  }

  startHealthCheck() {
    setInterval(async () => {
      try {
        await axios.put(
          `${this.gatewayUrl}/services/${this.serviceName}/health`,
          {
            status: "healthy",
            timestamp: new Date().toISOString(),
          }
        );
      } catch (error) {
        console.error("Health check failed:", error.message);
      }
    }, this.healthCheckInterval);
  }

  async unregisterService() {
    try {
      await axios.delete(`${this.gatewayUrl}/services/${this.serviceName}`);
      console.log("Service unregistered from API Gateway");
    } catch (error) {
      console.error("Failed to unregister from API Gateway:", error.message);
    }
  }
}

export const apiGatewayClient = new APIGatewayClient();
