const express = require("express");
const {
  processPayment,
  getPaymentDetails,
  processCashPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.route("/").post(processPayment);

router.route("/:orderId").get(getPaymentDetails);

router.route("/cash").post(processCashPayment);

module.exports = router;
