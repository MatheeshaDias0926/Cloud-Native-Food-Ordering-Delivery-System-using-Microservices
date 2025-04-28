const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    distance: Number, // in kilometers
    deliveryFee: Number,
    specialInstructions: String,
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
deliverySchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Delivery", deliverySchema);
