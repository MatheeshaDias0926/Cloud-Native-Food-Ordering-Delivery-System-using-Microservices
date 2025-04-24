const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  createdAt: { type: Date, default: Date.now },
});

DeliverySchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Delivery", DeliverySchema);
