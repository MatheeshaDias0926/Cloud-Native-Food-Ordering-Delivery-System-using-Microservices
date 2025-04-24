import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("available"); // available, busy, offline

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const response = await api.getDeliveriesByDeliveryPerson(user?._id);
        setDeliveries(response.data.data || []);
      } catch (err) {
        setError("Failed to load deliveries. Please try again later.");
        console.error("Error fetching deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDeliveries();
    }
  }, [user?._id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.updateDeliveryPersonStatus(user?._id, newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeliveryStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await api.updateDeliveryStatus(deliveryId, newStatus);
      setDeliveries(
        deliveries.map((delivery) =>
          delivery._id === deliveryId
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );
    } catch (err) {
      console.error("Error updating delivery status:", err);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
        <div className="space-x-4">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Today's Deliveries</h2>
          <p className="text-3xl font-bold">
            {
              deliveries.filter(
                (delivery) =>
                  new Date(delivery.createdAt).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Active Deliveries</h2>
          <p className="text-3xl font-bold">
            {
              deliveries.filter((delivery) => delivery.status === "in_progress")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Completed Today</h2>
          <p className="text-3xl font-bold">
            {
              deliveries.filter(
                (delivery) =>
                  delivery.status === "completed" &&
                  new Date(delivery.completedAt).toDateString() ===
                    new Date().toDateString()
              ).length
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Deliveries</h2>
        {deliveries.length === 0 ? (
          <p className="text-gray-600">No deliveries assigned</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Restaurant</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Pickup Address</th>
                  <th className="px-6 py-3 text-left">Delivery Address</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery._id} className="border-t">
                    <td className="px-6 py-4">{delivery.orderId}</td>
                    <td className="px-6 py-4">{delivery.restaurant?.name}</td>
                    <td className="px-6 py-4">{delivery.customer?.name}</td>
                    <td className="px-6 py-4">{delivery.pickupAddress}</td>
                    <td className="px-6 py-4">{delivery.deliveryAddress}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded ${
                          delivery.status === "pending"
                            ? "bg-yellow-200"
                            : delivery.status === "in_progress"
                            ? "bg-blue-200"
                            : delivery.status === "completed"
                            ? "bg-green-200"
                            : "bg-gray-200"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={delivery.status}
                        onChange={(e) =>
                          handleDeliveryStatusUpdate(
                            delivery._id,
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
