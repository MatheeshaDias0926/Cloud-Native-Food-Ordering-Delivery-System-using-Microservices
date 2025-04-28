const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

// All routes will be prefixed with /api/v1/orders by the API Gateway
router.use(protect);

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder);

router
  .route("/:id/status")
  .put(restrictTo("restaurant", "admin"), updateOrderStatus);

router
  .route("/:id/cancel")
  .put(restrictTo("customer", "restaurant", "admin"), cancelOrder);

module.exports = router;
