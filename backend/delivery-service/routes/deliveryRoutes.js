const express = require("express");
const {
  createDelivery,
  getDeliveryById,
  updateDeliveryStatus,
  updateDeliveryLocation,
  getActiveDeliveries,
  getUserDeliveries,
} = require("../controllers/deliveryController");
const {
  requireAuth,
  requireRoleDeliveryPersonnel,
  requireRoleBuyer,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Delivery personnel routes
router.post("/", requireAuth, requireRoleDeliveryPersonnel, createDelivery);
router.get(
  "/active",
  requireAuth,
  requireRoleDeliveryPersonnel,
  getActiveDeliveries
);
router.patch(
  "/:id/status",
  requireAuth,
  requireRoleDeliveryPersonnel,
  updateDeliveryStatus
);
router.patch(
  "/:id/location",
  requireAuth,
  requireRoleDeliveryPersonnel,
  updateDeliveryLocation
);

// User routes
router.get("/my-deliveries", requireAuth, requireRoleBuyer, getUserDeliveries);
router.get("/:id", requireAuth, getDeliveryById);

module.exports = router;
