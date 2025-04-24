const User = require("../models/User");
const Delivery = require("../models/Delivery");
const Order = require("../models/Order");
const geocoder = require("./geocoder");

module.exports = async (orderId, restaurantLocation) => {
  try {
    // Find available delivery personnel near the restaurant
    const deliveryPersons = await User.find({
      role: "delivery",
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: restaurantLocation.coordinates,
          },
          $maxDistance: 10000, // 10km radius
        },
      },
    }).limit(5);

    if (deliveryPersons.length === 0) {
      console.log("No available delivery personnel found");
      return;
    }

    // Create delivery record
    const delivery = await Delivery.create({
      order: orderId,
      deliveryPerson: deliveryPersons[0]._id,
      currentLocation: restaurantLocation,
    });

    // Update order with delivery info
    await Order.findByIdAndUpdate(orderId, {
      deliveryPerson: deliveryPersons[0]._id,
      status: "confirmed",
    });

    // Notify delivery person (in a real app, this would be a push notification)
    console.log(
      `Assigned order ${orderId} to delivery person ${deliveryPersons[0].name}`
    );
  } catch (err) {
    console.error("Error assigning driver:", err);
  }
};
