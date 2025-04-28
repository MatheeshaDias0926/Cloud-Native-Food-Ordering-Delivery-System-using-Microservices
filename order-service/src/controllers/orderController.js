const Order = require("../models/Order");
const axios = require("axios");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Notify restaurant service about new order
    await axios.post(
      `${process.env.RESTAURANT_SERVICE_URL}/orders/${order._id}/notify`,
      {
        orderId: order._id,
        restaurantId: order.restaurantId,
      }
    );

    res.status(201).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Notify delivery service if order is ready for delivery
    if (status === "out_for_delivery") {
      await axios.post(
        `${process.env.DELIVERY_SERVICE_URL}/orders/${order._id}/assign`,
        {
          orderId: order._id,
          deliveryAddress: order.deliveryAddress,
        }
      );
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Notify payment service to process refund if payment was made
    if (order.paymentStatus === "paid") {
      await axios.post(`${process.env.PAYMENT_SERVICE_URL}/refund`, {
        orderId: order._id,
        amount: order.totalAmount,
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};
