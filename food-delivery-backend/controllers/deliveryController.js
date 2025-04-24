const Delivery = require("../models/Delivery");
const Order = require("../models/Order");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all deliveries
// @route   GET /api/v1/deliveries
// @access  Private (Admin, Delivery)
exports.getDeliveries = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === "admin") {
      query = Delivery.find().populate("order deliveryPerson");
    } else {
      query = Delivery.find({ deliveryPerson: req.user.id }).populate("order");
    }

    const deliveries = await query;

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single delivery
// @route   GET /api/v1/deliveries/:id
// @access  Private
exports.getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate(
      "order deliveryPerson"
    );

    if (!delivery) {
      return next(
        new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is authorized to access this delivery
    if (
      delivery.deliveryPerson._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this delivery`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update delivery status
// @route   PUT /api/v1/deliveries/:id/status
// @access  Private (Delivery)
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return next(
        new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404)
      );
    }

    // Check authorization
    if (delivery.deliveryPerson.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this delivery`,
          401
        )
      );
    }

    // Validate status transition
    const validTransitions = {
      assigned: ["picked_up"],
      picked_up: ["in_transit"],
      in_transit: ["delivered", "failed"],
      delivered: [],
      failed: [],
    };

    if (!validTransitions[delivery.status].includes(req.body.status)) {
      return next(
        new ErrorResponse(
          `Invalid status transition from ${delivery.status} to ${req.body.status}`,
          400
        )
      );
    }

    delivery.status = req.body.status;

    // Update timestamps based on status
    if (req.body.status === "picked_up") {
      delivery.pickupTime = Date.now();
    } else if (
      req.body.status === "delivered" ||
      req.body.status === "failed"
    ) {
      delivery.deliveryTime = Date.now();
    }

    await delivery.save();

    // Update corresponding order status
    if (req.body.status === "delivered") {
      await Order.findByIdAndUpdate(delivery.order, { status: "delivered" });
    } else if (req.body.status === "failed") {
      await Order.findByIdAndUpdate(delivery.order, { status: "cancelled" });
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update delivery location
// @route   PUT /api/v1/deliveries/:id/location
// @access  Private (Delivery)
exports.updateDeliveryLocation = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return next(
        new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404)
      );
    }

    // Check authorization
    if (delivery.deliveryPerson.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this delivery`,
          401
        )
      );
    }

    // Update location
    delivery.currentLocation = {
      type: "Point",
      coordinates: [req.body.longitude, req.body.latitude],
    };

    await delivery.save();

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept delivery assignment
// @route   PUT /api/v1/deliveries/:id/accept
// @access  Private (Delivery)
exports.acceptDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return next(
        new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if already assigned to someone else
    if (
      delivery.deliveryPerson &&
      delivery.deliveryPerson.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse(`Delivery already assigned to another driver`, 400)
      );
    }

    // Assign to current user
    delivery.deliveryPerson = req.user.id;
    delivery.status = "assigned";
    await delivery.save();

    // Update order with delivery person
    await Order.findByIdAndUpdate(delivery.order, {
      deliveryPerson: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};
