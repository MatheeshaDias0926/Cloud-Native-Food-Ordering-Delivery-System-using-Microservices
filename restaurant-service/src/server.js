const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// Load env vars
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Connect to database
connectDB();

// Route files
const restaurants = require("./routes/restaurantRoutes");

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Restaurant Service is healthy" });
});

// Mount routers
app.use("/api/v1/restaurants", restaurants);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

const server = app.listen(
  PORT,
  console.log(
    `Restaurant Service running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
