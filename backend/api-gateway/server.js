const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Service routes
const services = {
  "user-service": process.env.USER_SERVICE_URL || "http://user-service:3001",
  "restaurant-service":
    process.env.RESTAURANT_SERVICE_URL || "http://restaurant-service:3002",
  "order-service": process.env.ORDER_SERVICE_URL || "http://order-service:3003",
  "delivery-service":
    process.env.DELIVERY_SERVICE_URL || "http://delivery-service:3004",
  "payment-service":
    process.env.PAYMENT_SERVICE_URL || "http://payment-service:3005",
  "notification-service":
    process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:3006",
};

// Proxy middleware configuration
Object.entries(services).forEach(([service, url]) => {
  app.use(
    `/api/${service}`,
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/${service}`]: "",
      },
      onError: (err, req, res) => {
        console.error(`Proxy Error: ${err.message}`);
        res.status(500).json({ error: "Service temporarily unavailable" });
      },
    })
  );
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
