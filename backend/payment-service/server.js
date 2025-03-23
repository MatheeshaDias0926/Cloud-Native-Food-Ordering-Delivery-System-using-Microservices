const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser());

// Routes
app.use("/api/payments", paymentRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3005, () => {
      console.log(
        `Payment service running on port ${process.env.PORT || 3005}`
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
