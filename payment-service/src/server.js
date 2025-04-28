const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - will be prefixed with /api/v1/payments by the API Gateway
app.use("/", paymentRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3006; // Changed to 3006 to avoid conflicts
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
