const Delivery = require("../models/Delivery");
const axios = require("axios");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all deliveries
// @route   GET /api/v1/deliveries
// @access  Private
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching deliveries", error: error.message });
  }
};

// @desc    Get single delivery
// @route   GET /api/v1/deliveries/:id
// @access  Private
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching delivery", error: error.message });
  }
};

// @desc    Accept delivery
// @route   PUT /api/v1/deliveries/:id/accept
// @access  Private (Delivery Person)
exports.acceptDelivery = async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { deliveryPersonId, status: "assigned" },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting delivery", error: error.message });
  }
};

// @desc    Update delivery status
// @route   PUT /api/v1/deliveries/:id/status
// @access  Private (Delivery Person)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Update order status in order service
    if (status === "delivered") {
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/orders/${delivery.orderId}/status`,
        {
          status: "delivered",
        }
      );
    }

    res.status(200).json(delivery);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating delivery status",
        error: error.message,
      });
  }
};

// @desc    Update delivery location
// @route   PUT /api/v1/deliveries/:id/location
// @access  Private (Delivery Person)
exports.updateDeliveryLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { currentLocation: { type: "Point", coordinates } },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating delivery location",
        error: error.message,
      });
  }
};
