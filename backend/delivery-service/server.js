const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/deliveries", deliveryRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3003, () => {
      console.log(
        `Delivery service running on port ${process.env.PORT || 3003}`
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
