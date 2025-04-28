const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const orderRoutes = require("./routes/orderRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - will be prefixed with /api/v1/orders by the API Gateway
app.use("/", orderRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3004; // Changed to 3004 to avoid conflicts
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
