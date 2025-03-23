const express = require("express");
const {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignDeliveryPersonnel,
  updatePaymentStatus,
  getDeliveryPersonnelOrders,
} = require("../controllers/orderController");
const {
  requireAuth,
  requireRoleSeller,
  requireRoleDeliveryPersonnel,
  requireRoleBuyer,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Buyer routes
router.post("/", requireAuth, requireRoleBuyer, createOrder);
router.get("/my-orders", requireAuth, requireRoleBuyer, getUserOrders);

// Restaurant routes
router.get(
  "/restaurant/:restaurantId",
  requireAuth,
  requireRoleSeller,
  getRestaurantOrders
);
router.patch("/:id/status", requireAuth, requireRoleSeller, updateOrderStatus);

// Delivery personnel routes
router.get(
  "/delivery",
  requireAuth,
  requireRoleDeliveryPersonnel,
  getDeliveryPersonnelOrders
);
router.patch(
  "/:id/assign-delivery",
  requireAuth,
  requireRoleDeliveryPersonnel,
  assignDeliveryPersonnel
);

// Payment routes
router.patch("/:id/payment", requireAuth, updatePaymentStatus);

module.exports = router;
