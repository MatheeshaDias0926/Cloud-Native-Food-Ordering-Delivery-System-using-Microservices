const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../config/sendEmail");
const assignDriver = require("../utils/assignDriver");

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private (Admin)
exports.getOrders = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === "admin") {
      query = Order.find().populate("customer restaurant deliveryPerson");
    } else if (req.user.role === "restaurant") {
      query = Order.find({ restaurant: req.user.restaurant }).populate(
        "customer deliveryPerson"
      );
    } else if (req.user.role === "delivery") {
      query = Order.find({ deliveryPerson: req.user._id }).populate(
        "customer restaurant"
      );
    } else {
      query = Order.find({ customer: req.user._id }).populate(
        "restaurant deliveryPerson"
      );
    }

    const orders = await query;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer restaurant deliveryPerson items.menuItem"
    );

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is authorized to access this order
    if (
      order.customer._id.toString() !== req.user.id &&
      order.restaurant.owner.toString() !== req.user.id &&
      order.deliveryPerson &&
      order.deliveryPerson._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this order`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    // Add customer to req.body
    req.body.customer = req.user.id;

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.body.restaurant}`,
          404
        )
      );
    }

    // Verify menu items exist and calculate total
    let totalAmount = 0;
    const items = [];

    for (const item of req.body.items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return next(
          new ErrorResponse(
            `Menu item not found with id of ${item.menuItem}`,
            404
          )
        );
      }

      if (!menuItem.isAvailable) {
        return next(
          new ErrorResponse(`Menu item ${menuItem.name} is not available`, 400)
        );
      }

      totalAmount += menuItem.price * item.quantity;
      items.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      restaurant: req.body.restaurant,
      items,
      totalAmount,
      deliveryAddress: req.body.deliveryAddress,
      paymentMethod: req.body.paymentMethod,
    });

    // Assign driver (async)
    assignDriver(order._id, restaurant.location);

    // Send order confirmation email
    await sendEmail({
      email: req.user.email,
      subject: "Your Food Delivery Order",
      message: `Your order #${order._id} has been placed successfully. Total amount: ${totalAmount}`,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Restaurant Owner or Delivery)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    // Check authorization
    if (
      order.restaurant.toString() !== req.user.restaurant?.toString() &&
      order.deliveryPerson &&
      order.deliveryPerson.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this order`,
          401
        )
      );
    }

    // Validate status transition
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["out_for_delivery", "cancelled"],
      out_for_delivery: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(req.body.status)) {
      return next(
        new ErrorResponse(
          `Invalid status transition from ${order.status} to ${req.body.status}`,
          400
        )
      );
    }

    order.status = req.body.status;

    // If status is out_for_delivery and no driver assigned, assign one
    if (req.body.status === "out_for_delivery" && !order.deliveryPerson) {
      const restaurant = await Restaurant.findById(order.restaurant);
      await assignDriver(order._id, restaurant.location);
    }

    await order.save();

    // Send status update notification
    if (req.user.role === "restaurant") {
      const customer = await User.findById(order.customer);
      await sendEmail({
        email: customer.email,
        subject: "Order Status Update",
        message: `Your order #${order._id} status has been updated to ${req.body.status}`,
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private (Customer)
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    // Check authorization
    if (order.customer.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to cancel this order`,
          401
        )
      );
    }

    // Only allow cancellation if order is pending or confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return next(
        new ErrorResponse(
          `Order cannot be cancelled in its current status (${order.status})`,
          400
        )
      );
    }

    order.status = "cancelled";
    await order.save();

    // Send cancellation email
    await sendEmail({
      email: req.user.email,
      subject: "Order Cancelled",
      message: `Your order #${order._id} has been cancelled successfully`,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};
