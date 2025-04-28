const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  deliveryPersonId: {
    type: String,
    required: true,
  },
  pickupTime: { type: Date },
  deliveryTime: { type: Date },
  status: {
    type: String,
    enum: ["assigned", "picked_up", "in_transit", "delivered", "failed"],
    default: "assigned",
  },
  currentLocation: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number] },
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

DeliverySchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Delivery", DeliverySchema);
