const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/restaurants", restaurantRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3001, () => {
      console.log(
        `Restaurant service running on port ${process.env.PORT || 3001}`
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
