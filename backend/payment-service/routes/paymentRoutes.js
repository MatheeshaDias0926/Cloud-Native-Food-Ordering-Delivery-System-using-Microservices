const express = require("express");
const {
  createPaymentIntent,
  handleStripeWebhook,
  processRefund,
  getPaymentById,
  getUserPayments,
} = require("../controllers/paymentController");
const {
  requireAuth,
  requireRoleAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public webhook route (no auth required)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Protected routes
router.post("/create-payment-intent", requireAuth, createPaymentIntent);
router.get("/my-payments", requireAuth, getUserPayments);
router.get("/:id", requireAuth, getPaymentById);

// Admin routes
router.post("/:paymentId/refund", requireAuth, requireRoleAdmin, processRefund);

module.exports = router;
