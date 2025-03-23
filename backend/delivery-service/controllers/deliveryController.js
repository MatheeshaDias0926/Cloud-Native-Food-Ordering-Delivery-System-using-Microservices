const Delivery = require("../models/Delivery");
const axios = require("axios");

// Create a new delivery
const createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery({
      ...req.body,
      deliveryPersonnelId: req.userId,
    });
    await delivery.save();

    // Notify user about delivery creation
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: delivery.userId,
        type: "delivery_created",
        deliveryId: delivery._id,
        message:
          "Your delivery has been created and assigned to a delivery personnel",
      }
    );

    res
      .status(201)
      .json({ message: "Delivery created successfully", delivery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating delivery" });
  }
};

// Get delivery by ID
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("orderId")
      .populate("deliveryPersonnelId", "name mobile")
      .populate("restaurantId", "name address");
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    res.status(200).json({ delivery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching delivery" });
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.status = req.body.status;

    // Update timestamps based on status
    if (req.body.status === "picked_up") {
      delivery.pickedUpAt = Date.now();
    } else if (req.body.status === "delivered") {
      delivery.deliveredAt = Date.now();
      delivery.actualDeliveryTime = Date.now();
    }

    await delivery.save();

    // Notify user about status update
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      {
        userId: delivery.userId,
        type: "delivery_status_update",
        deliveryId: delivery._id,
        message: `Your delivery status has been updated to ${req.body.status}`,
      }
    );

    // Update order status
    await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/api/orders/${delivery.orderId}/status`,
      {
        status:
          req.body.status === "delivered" ? "delivered" : "out_for_delivery",
      }
    );

    res
      .status(200)
      .json({ message: "Delivery status updated successfully", delivery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating delivery status" });
  }
};

// Update delivery location
const updateDeliveryLocation = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const location = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      timestamp: Date.now(),
    };

    delivery.currentLocation = location;
    delivery.locationHistory.push(location);
    await delivery.save();

    res
      .status(200)
      .json({ message: "Delivery location updated successfully", delivery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating delivery location" });
  }
};

// Get delivery personnel's active deliveries
const getActiveDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      deliveryPersonnelId: req.userId,
      status: { $in: ["assigned", "picked_up", "in_transit"] },
    })
      .populate("orderId")
      .populate("restaurantId", "name address")
      .populate("userId", "name mobile");
    res.status(200).json({ deliveries });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching active deliveries" });
  }
};

// Get user's delivery history
const getUserDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ userId: req.userId })
      .populate("orderId")
      .populate("deliveryPersonnelId", "name mobile")
      .populate("restaurantId", "name");
    res.status(200).json({ deliveries });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching user deliveries" });
  }
};

module.exports = {
  createDelivery,
  getDeliveryById,
  updateDeliveryStatus,
  updateDeliveryLocation,
  getActiveDeliveries,
  getUserDeliveries,
};
