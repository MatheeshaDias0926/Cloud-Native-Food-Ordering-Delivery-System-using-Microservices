import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { errorHandler } from "./middlewares/errorHandler.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import { apiGatewayClient } from "./config/apiGateway.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression
app.use(compression());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "delivery-service",
    version: process.env.npm_package_version,
  });
});

// Routes
app.use("/api/v1/deliveries", deliveryRoutes);

// Error handling
app.use(errorHandler);

// Database connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("Connected to MongoDB");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error("Failed to connect to MongoDB after all retries");
  process.exit(1);
};

// Start server
const PORT = process.env.PORT || 3005;
const server = app.listen(PORT, async () => {
  console.log(`Delivery Service running on port ${PORT}`);
  await connectWithRetry();
  await apiGatewayClient.registerService();
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down gracefully...");

  try {
    await apiGatewayClient.unregisterService();
    await mongoose.connection.close();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
