const axios = require("axios");
const ErrorResponse = require("./errorResponse");

class ServiceClient {
  constructor() {
    this.userServiceBaseUrl =
      process.env.USER_SERVICE_URL || "http://localhost:5000";
  }

  async verifyToken(token) {
    try {
      const response = await axios.post(
        `${this.userServiceBaseUrl}/api/v1/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new ErrorResponse("Failed to verify token", 401);
    }
  }

  async getUserById(userId, token) {
    try {
      const response = await axios.get(
        `${this.userServiceBaseUrl}/api/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new ErrorResponse("Failed to fetch user data", 401);
    }
  }
}

module.exports = new ServiceClient();
