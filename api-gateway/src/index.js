require("dotenv").config();

// Verify environment variables
const requiredEnvVars = [
  "USER_SERVICE_URL",
  "RESTAURANT_SERVICE_URL",
  "ORDER_SERVICE_URL",
  "DELIVERY_SERVICE_URL",
  "JWT_SECRET",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authMiddleware = require("./middlewares/auth");
const rateLimiter = require("./middlewares/rateLimiter");
const userService = require("./services/userService");
const restaurantService = require("./services/restaurantService");
const orderService = require("./services/orderService");
const deliveryService = require("./services/deliveryService");

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser - increase limit and add raw body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  next();
});

// Rate Limiting
app.use(rateLimiter);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is healthy" });
});

// Service Proxies with Authentication
app.use("/api/v1/auth", (req, res, next) => {
  // Handle login and register routes
  if (
    req.method === "POST" &&
    (req.path === "/login" || req.path === "/register")
  ) {
    console.log("Handling auth request:", {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
    });
    // Ensure the request is forwarded as POST
    req.method = "POST";
    userService(req, res, next);
  } else if (req.method === "GET" && req.path === "/me") {
    // Handle get current user route
    authMiddleware(req, res, () => {
      console.log("Handling get current user request:", {
        method: req.method,
        path: req.path,
        user: req.user,
      });
      userService(req, res, next);
    });
  } else {
    // For other auth routes, require authentication
    authMiddleware(req, res, () => {
      console.log("Handling authenticated auth request:", {
        method: req.method,
        path: req.path,
        user: req.user,
      });
      userService(req, res, next);
    });
  }
});

app.use("/api/v1/restaurants", authMiddleware, restaurantService);

app.use("/api/v1/orders", authMiddleware, orderService);

app.use("/api/v1/deliveries", authMiddleware, deliveryService);

// Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    details: err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log("Service URLs:");
  console.log(`- User Service: ${process.env.USER_SERVICE_URL}`);
  console.log(`- Restaurant Service: ${process.env.RESTAURANT_SERVICE_URL}`);
  console.log(`- Order Service: ${process.env.ORDER_SERVICE_URL}`);
  console.log(`- Delivery Service: ${process.env.DELIVERY_SERVICE_URL}`);
});
