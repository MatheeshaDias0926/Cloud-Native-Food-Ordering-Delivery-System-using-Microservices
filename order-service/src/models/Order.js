const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: String,
    required: true,
  },
  items: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String },
  deliveryPersonId: { type: String },
  estimatedDeliveryTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
