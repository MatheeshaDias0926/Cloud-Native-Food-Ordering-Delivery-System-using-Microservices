const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Enhanced security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:*"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(compression());
app.use(morgan("combined"));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 failed login attempts per hour
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use(limiter);

// Apply stricter rate limiting to auth routes
app.use("/api/user-service/auth", authLimiter);

// Service routes with circuit breaker
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

// Circuit breaker configuration
const circuitBreaker = {
  failureThreshold: 5,
  resetTimeout: 30000,
  state: "CLOSED",
  failures: 0,
  lastFailureTime: null,
};

// Proxy middleware configuration with circuit breaker
Object.entries(services).forEach(([service, url]) => {
  app.use(
    `/api/${service}`,
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/${service}`]: service === "user-service" ? "/api/user" : "",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.url} to ${url}`);
        // Reset circuit breaker on successful request
        if (circuitBreaker.state === "OPEN") {
          const now = Date.now();
          if (
            now - circuitBreaker.lastFailureTime >=
            circuitBreaker.resetTimeout
          ) {
            circuitBreaker.state = "CLOSED";
            circuitBreaker.failures = 0;
          }
        }
      },
      onError: (err, req, res) => {
        console.error(`Proxy Error: ${err.message}`);
        console.error(`Request URL: ${req.url}`);
        console.error(`Request Method: ${req.method}`);
        console.error(`Request Body:`, req.body);

        // Circuit breaker logic
        if (circuitBreaker.state === "CLOSED") {
          circuitBreaker.failures++;
          if (circuitBreaker.failures >= circuitBreaker.failureThreshold) {
            circuitBreaker.state = "OPEN";
            circuitBreaker.lastFailureTime = Date.now();
          }
        }

        res.status(503).json({
          error: "Service temporarily unavailable",
          message: "Circuit breaker is open",
        });
      },
    })
  );
});

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Service health checks with timeout
const checkServiceHealth = async (service, url) => {
  try {
    const response = await axios.get(`${url}/health`, {
      timeout: 5000, // 5 second timeout
    });
    return response.status === 200;
  } catch (error) {
    console.error(`Health check failed for ${service}:`, error.message);
    return false;
  }
};

app.get("/health/status", async (req, res) => {
  const healthStatus = {
    apiGateway: true,
    timestamp: new Date().toISOString(),
    services: {},
  };

  const healthChecks = await Promise.all(
    Object.entries(services).map(async ([service, url]) => {
      const isHealthy = await checkServiceHealth(service, url);
      return [service, isHealthy];
    })
  );

  healthStatus.services = Object.fromEntries(healthChecks);
  const allServicesHealthy = healthChecks.every(([_, status]) => status);

  res.status(allServicesHealthy ? 200 : 503).json(healthStatus);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
