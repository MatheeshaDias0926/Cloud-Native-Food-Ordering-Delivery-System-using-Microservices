import express from "express";
import { body, param } from "express-validator";
import { protect, authorize } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import * as deliveryController from "../controllers/deliveryController.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// @api GET /api/v1/deliveries
// @desc Get all deliveries
// @access Private
router.get("/", deliveryController.getDeliveries);

// @api GET /api/v1/deliveries/:id
// @desc Get single delivery
// @access Private
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid delivery ID")],
  validateRequest,
  deliveryController.getDelivery
);

// @api PUT /api/v1/deliveries/:id/status
// @desc Update delivery status
// @access Private (Delivery Person, Admin)
router.put(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid delivery ID"),
    body("status")
      .isIn(["assigned", "picked_up", "in_transit", "delivered", "failed"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  authorize("delivery", "admin"),
  deliveryController.updateDeliveryStatus
);

// @api PUT /api/v1/deliveries/:id/location
// @desc Update delivery location
// @access Private (Delivery Person, Admin)
router.put(
  "/:id/location",
  [
    param("id").isMongoId().withMessage("Invalid delivery ID"),
    body("coordinates")
      .isArray({ min: 2, max: 2 })
      .withMessage("Coordinates must be an array of 2 numbers")
      .custom((value) => {
        return value.every((coord) => typeof coord === "number");
      })
      .withMessage("Coordinates must be numbers"),
  ],
  validateRequest,
  authorize("delivery", "admin"),
  deliveryController.updateDeliveryLocation
);

// @api PUT /api/v1/deliveries/:id/accept
// @desc Accept delivery
// @access Private (Delivery Person, Admin)
router.put(
  "/:id/accept",
  [
    param("id").isMongoId().withMessage("Invalid delivery ID"),
    body("deliveryPersonId")
      .isMongoId()
      .withMessage("Invalid delivery person ID"),
  ],
  validateRequest,
  authorize("delivery", "admin"),
  deliveryController.acceptDelivery
);

export default router;
