const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Process payment
// @route   POST /api/v1/payments
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, paymentMethod, customerId } = req.body;

    // Create payment record
    const payment = new Payment({
      orderId,
      amount,
      paymentMethod,
      customerId,
      status: "pending",
    });

    // Process payment based on method
    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      try {
        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: "usd",
          payment_method_types: ["card"],
        });

        payment.paymentIntentId = paymentIntent.id;
        payment.status = "completed";
        await payment.save();

        // Update order payment status
        await axios.put(
          `${process.env.ORDER_SERVICE_URL}/orders/${orderId}/payment-status`,
          {
            paymentStatus: "paid",
          }
        );

        res.status(200).json({
          success: true,
          payment,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        payment.status = "failed";
        await payment.save();
        throw error;
      }
    } else if (paymentMethod === "cash") {
      payment.status = "completed";
      await payment.save();

      // Update order payment status
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/orders/${orderId}/payment-status`,
        {
          paymentStatus: "paid",
        }
      );

      res.status(200).json({
        success: true,
        payment,
      });
    } else {
      throw new Error("Unsupported payment method");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// @desc    Get payment details
// @route   GET /api/v1/payments/:orderId
// @access  Private
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payment details",
      error: error.message,
    });
  }
};

// @desc    Process refund
// @route   POST /api/v1/payments/:orderId/refund
// @access  Private
exports.processRefund = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Payment not completed, cannot refund" });
    }

    if (
      payment.paymentMethod === "credit_card" ||
      payment.paymentMethod === "debit_card"
    ) {
      try {
        // Create refund with Stripe
        const refund = await stripe.refunds.create({
          payment_intent: payment.paymentIntentId,
          amount: amount * 100, // Convert to cents
        });

        payment.refundId = refund.id;
        payment.status = "refunded";
        await payment.save();

        // Update order payment status
        await axios.put(
          `${process.env.ORDER_SERVICE_URL}/orders/${orderId}/payment-status`,
          {
            paymentStatus: "refunded",
          }
        );

        res.status(200).json({
          success: true,
          payment,
        });
      } catch (error) {
        throw error;
      }
    } else if (payment.paymentMethod === "cash") {
      payment.status = "refunded";
      await payment.save();

      // Update order payment status
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/orders/${orderId}/payment-status`,
        {
          paymentStatus: "refunded",
        }
      );

      res.status(200).json({
        success: true,
        payment,
      });
    } else {
      throw new Error("Unsupported payment method for refund");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: error.message,
    });
  }
};
