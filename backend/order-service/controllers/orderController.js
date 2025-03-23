const Order = require("../models/Order");
const axios = require("axios");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.userId,
    });
    await order.save();

    // Notify restaurant about new order
    await axios.post(
      `${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${order.restaurantId}/orders`,
      {
        orderId: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
      }
    );

    // Notify user about order confirmation
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: order.userId,
        type: "order_confirmation",
        orderId: order._id,
        message: "Your order has been placed successfully!",
      }
    );

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("restaurantId", "name")
      .populate("deliveryPersonnelId", "name");
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get restaurant's orders
const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId })
      .populate("userId", "name mobile")
      .populate("deliveryPersonnelId", "name");
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Notify user about status change
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: order.userId,
        type: "order_status_update",
        orderId: order._id,
        message: `Your order status has been updated to ${req.body.status}`,
      }
    );

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Assign delivery personnel
const assignDeliveryPersonnel = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryPersonnelId: req.body.deliveryPersonnelId,
        status: "out_for_delivery",
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Notify delivery personnel
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: req.body.deliveryPersonnelId,
        type: "delivery_assigned",
        orderId: order._id,
        message: "You have been assigned a new delivery",
      }
    );

    // Notify user
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: order.userId,
        type: "delivery_assigned",
        orderId: order._id,
        message: "A delivery personnel has been assigned to your order",
      }
    );

    res
      .status(200)
      .json({ message: "Delivery personnel assigned successfully", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error assigning delivery personnel" });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If payment is successful, update order status
    if (req.body.paymentStatus === "paid") {
      order.status = "confirmed";
      await order.save();
    }

    res
      .status(200)
      .json({ message: "Payment status updated successfully", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating payment status" });
  }
};

// Get delivery personnel's orders
const getDeliveryPersonnelOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPersonnelId: req.userId })
      .populate("userId", "name mobile")
      .populate("restaurantId", "name");
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignDeliveryPersonnel,
  updatePaymentStatus,
  getDeliveryPersonnelOrders,
};
