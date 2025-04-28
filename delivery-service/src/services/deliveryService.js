import Delivery from "../models/Delivery.js";
import { CircuitBreaker } from "circuit-breaker-js";
import axios from "axios";

const circuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 5000,
});

export class DeliveryService {
  static async getAllDeliveries() {
    return await Delivery.find();
  }

  static async getDeliveryById(id) {
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      throw new Error("Delivery not found");
    }
    return delivery;
  }

  static async acceptDelivery(id, deliveryPersonId) {
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { deliveryPersonId, status: "assigned" },
      { new: true }
    );

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    return delivery;
  }

  static async updateDeliveryStatus(id, status) {
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    if (status === "delivered") {
      await this.updateOrderStatus(delivery.orderId, "delivered");
    }

    return delivery;
  }

  static async updateDeliveryLocation(id, coordinates) {
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { currentLocation: { type: "Point", coordinates } },
      { new: true }
    );

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    return delivery;
  }

  static async updateOrderStatus(orderId, status) {
    try {
      await circuitBreaker.execute(() =>
        axios.put(`${process.env.ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          status,
        })
      );
    } catch (error) {
      console.error("Failed to update order status:", error.message);
      // We don't throw here as the delivery status is already updated
    }
  }
}
