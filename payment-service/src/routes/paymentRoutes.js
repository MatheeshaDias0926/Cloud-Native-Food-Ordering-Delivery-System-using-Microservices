const express = require("express");
const {
  processPayment,
  getPaymentDetails,
  processRefund,
} = require("../controllers/paymentController");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

// All routes will be prefixed with /api/v1/payments by the API Gateway
router.use(protect);

router.route("/").post(restrictTo("customer", "admin"), processPayment);

router.route("/:orderId").get(getPaymentDetails);

router
  .route("/refund")
  .post(restrictTo("customer", "restaurant", "admin"), processRefund);

module.exports = router;
