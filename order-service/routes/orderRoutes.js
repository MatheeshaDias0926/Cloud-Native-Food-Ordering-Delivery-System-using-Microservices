const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../../../Cloud-Native-Food-Ordering-Delivery-System-using-Microservices/food-delivery-backend/controllers/orderController");
const { protect } = require("../../../Cloud-Native-Food-Ordering-Delivery-System-using-Microservices/food-delivery-backend/middlewares/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder);

router.route("/:id/status").put(updateOrderStatus);

router.route("/:id/cancel").put(cancelOrder);

module.exports = router;
