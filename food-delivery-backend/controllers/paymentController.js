const Order = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");

// Dummy payment gateway
const dummyPaymentGateway = {
  processPayment: async (amount, currency, token, description, metadata) => {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate successful payment
    return {
      id: `dummy_charge_${Date.now()}`,
      amount: amount,
      currency: currency,
      description: description,
      metadata: metadata,
      receipt_url: `https://example.com/receipts/${Date.now()}`,
      status: "succeeded",
    };
  },
};

// @desc    Process payment
// @route   POST /api/v1/payments
// @access  Private (Customer)
exports.processPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.body.orderId}`, 404)
      );
    }

    // Check authorization
    if (order.customer.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to pay for this order`,
          401
        )
      );
    }

    // Check if already paid
    if (order.paymentStatus === "paid") {
      return next(new ErrorResponse(`Order already paid`, 400));
    }

    // Process payment using dummy gateway
    const charge = await dummyPaymentGateway.processPayment(
      order.totalAmount * 100, // in cents
      "usd",
      req.body.token,
      `Payment for order ${order._id}`,
      { order_id: order._id.toString() }
    );

    // Update order payment status
    order.paymentStatus = "paid";
    order.paymentMethod = "card";
    order.paymentDetails = {
      chargeId: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency,
      receiptUrl: charge.receipt_url,
    };
    await order.save();

    res.status(200).json({
      success: true,
      data: charge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get payment details
// @route   GET /api/v1/payments/:orderId
// @access  Private
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(
        new ErrorResponse(
          `Order not found with id of ${req.params.orderId}`,
          404
        )
      );
    }

    // Check authorization
    if (
      order.customer.toString() !== req.user.id &&
      order.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this payment`,
          401
        )
      );
    }

    if (!order.paymentDetails) {
      return next(
        new ErrorResponse(`No payment details found for this order`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: order.paymentDetails,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Process cash payment
// @route   POST /api/v1/payments/cash
// @access  Private (Restaurant Owner)
exports.processCashPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.body.orderId}`, 404)
      );
    }

    // Check authorization (restaurant owner)
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to mark this payment`,
          401
        )
      );
    }

    // Update order payment status
    order.paymentStatus = "paid";
    order.paymentMethod = "cash";
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};
