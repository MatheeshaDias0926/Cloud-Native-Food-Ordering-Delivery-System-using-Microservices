const { logger } = require("../utils/logger");
const { eventPublisher } = require("./eventPublisher");

const handleEvent = async (eventType, payload) => {
  try {
    switch (eventType) {
      case "USER_REGISTERED":
        await handleUserRegistered(payload);
        break;
      case "ORDER_CREATED":
        await handleOrderCreated(payload);
        break;
      case "ORDER_STATUS_UPDATED":
        await handleOrderStatusUpdated(payload);
        break;
      case "RESTAURANT_STATUS_CHANGED":
        await handleRestaurantStatusChanged(payload);
        break;
      default:
        logger.warn(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    logger.error(`Error handling event ${eventType}:`, error);
    throw error;
  }
};

const handleUserRegistered = async (payload) => {
  // Handle new user registration
  logger.info("Processing new user registration:", payload);
  // Add any necessary business logic here
};

const handleOrderCreated = async (payload) => {
  // Handle new order creation
  logger.info("Processing new order:", payload);
  // Notify relevant services
  await eventPublisher.publish("ORDER_NOTIFICATION", {
    orderId: payload.orderId,
    restaurantId: payload.restaurantId,
    customerId: payload.customerId,
  });
};

const handleOrderStatusUpdated = async (payload) => {
  // Handle order status updates
  logger.info("Processing order status update:", payload);
  // Notify relevant services
  await eventPublisher.publish("ORDER_STATUS_NOTIFICATION", {
    orderId: payload.orderId,
    status: payload.status,
    updatedAt: payload.updatedAt,
  });
};

const handleRestaurantStatusChanged = async (payload) => {
  // Handle restaurant status changes
  logger.info("Processing restaurant status change:", payload);
  // Notify relevant services
  await eventPublisher.publish("RESTAURANT_STATUS_NOTIFICATION", {
    restaurantId: payload.restaurantId,
    status: payload.status,
    updatedAt: payload.updatedAt,
  });
};

module.exports = {
  handleEvent,
};
