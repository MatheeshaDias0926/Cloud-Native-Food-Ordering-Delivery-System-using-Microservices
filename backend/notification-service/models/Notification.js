const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "order_confirmation",
      "order_status_update",
      "delivery_assigned",
      "delivery_status_update",
      "payment_success",
      "payment_failed",
      "payment_refunded",
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
  isRead: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  smsSent: { type: Boolean, default: false },
  metadata: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt timestamp before saving
notificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Notification", notificationSchema);
