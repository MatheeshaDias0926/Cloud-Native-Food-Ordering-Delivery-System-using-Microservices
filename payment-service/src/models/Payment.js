const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "cash", "wallet"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentIntentId: {
    type: String,
  },
  refundId: {
    type: String,
  },
  customerId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
