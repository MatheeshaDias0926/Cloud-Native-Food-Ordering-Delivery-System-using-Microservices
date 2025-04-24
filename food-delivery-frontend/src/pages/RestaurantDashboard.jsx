import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const [restaurantResponse, ordersResponse] = await Promise.all([
          api.getRestaurantById(user?.restaurantId),
          api.getRestaurantOrders(user?.restaurantId),
        ]);
        setRestaurant(restaurantResponse.data.data);
        setOrders(ordersResponse.data.data || []);
      } catch (err) {
        setError("Failed to load restaurant data. Please try again later.");
        console.error("Error fetching restaurant data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.restaurantId) {
      fetchRestaurantData();
    }
  }, [user?.restaurantId]);

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
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
        <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/restaurant/menu"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Menu
          </Link>
          <Link
            to="/restaurant/profile"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Restaurant Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Restaurant Info</h2>
          <p className="text-gray-600">{restaurant?.name}</p>
          <p className="text-gray-600">{restaurant?.address}</p>
          <p className="text-gray-600">{restaurant?.cuisineType}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Today's Orders</h2>
          <p className="text-3xl font-bold">
            {
              orders.filter(
                (order) =>
                  new Date(order.createdAt).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">
            $
            {orders
              .reduce((total, order) => total + order.totalAmount, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">{order.customer?.name}</td>
                    <td className="px-6 py-4">{order.items.length} items</td>
                    <td className="px-6 py-4">${order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded ${
                          order.status === "pending"
                            ? "bg-yellow-200"
                            : order.status === "preparing"
                            ? "bg-blue-200"
                            : order.status === "ready"
                            ? "bg-green-200"
                            : "bg-gray-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusUpdate(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
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

export default RestaurantDashboard;
