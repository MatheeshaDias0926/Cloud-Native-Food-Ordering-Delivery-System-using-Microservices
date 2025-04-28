const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "cash", "wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentIntentId: String, // For Stripe payments
    refundId: String, // For refunds
    paymentDetails: {
      cardLast4: String,
      cardBrand: String,
      cardExpMonth: Number,
      cardExpYear: Number,
    },
    error: {
      code: String,
      message: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
