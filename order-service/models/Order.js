const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, default: 1 },
      price: { type: Number },
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
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  estimatedDeliveryTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
