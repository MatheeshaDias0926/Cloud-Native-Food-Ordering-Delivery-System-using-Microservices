const express = require("express");
const {
  getDeliveries,
  getDelivery,
  updateDeliveryStatus,
  updateDeliveryLocation,
  acceptDelivery,
} = require("../controllers/deliveryController");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getDeliveries);

router.route("/:id").get(getDelivery);

router.route("/:id/status").put(restrictTo("delivery"), updateDeliveryStatus);

router
  .route("/:id/location")
  .put(restrictTo("delivery"), updateDeliveryLocation);

router.route("/:id/accept").put(restrictTo("delivery"), acceptDelivery);

module.exports = router;
