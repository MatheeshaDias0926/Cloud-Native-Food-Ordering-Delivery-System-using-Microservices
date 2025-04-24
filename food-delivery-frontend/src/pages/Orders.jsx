import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getOrders();
        setOrders(response.data.data || []);
      } catch (err) {
        setError("Failed to load orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "preparing":
        return "status-preparing";
      case "ready":
        return "status-ready";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="orders-content">
          <div className="empty-orders">
            <svg
              className="empty-orders-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="empty-orders-title">No Orders Yet</h2>
            <p className="empty-orders-text">
              You haven't placed any orders yet. Start ordering your favorite
              food!
            </p>
            <button
              className="browse-restaurants-button"
              onClick={() => navigate("/restaurants")}
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-content">
        <div className="orders-header">
          <h1 className="orders-title">Your Orders</h1>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #{order._id?.slice(-6)}</div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-content">
                <div className="restaurant-info">
                  <img
                    src={
                      order.restaurant?.image ||
                      "https://via.placeholder.com/64x64"
                    }
                    alt={order.restaurant?.name || "Restaurant"}
                    className="restaurant-image"
                  />
                  <div className="restaurant-details">
                    <h3 className="restaurant-name">
                      {order.restaurant?.name || "Unknown Restaurant"}
                    </h3>
                    <p className="restaurant-address">
                      {order.restaurant?.address || "Address not available"}
                    </p>
                  </div>
                </div>

                <div className="order-items">
                  {order.items?.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-details">
                        <span className="item-quantity">{item.quantity}x</span>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <span className="item-price">
                        ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">
                      ${(order.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Delivery Fee</span>
                    <span className="summary-value">$5.00</span>
                  </div>
                  <div className="summary-row total">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">
                      ${((order.subtotal || 0) + 5).toFixed(2)}
                    </span>
                  </div>
                </div>

                {order.deliveryPerson && (
                  <div className="delivery-info">
                    <h4 className="delivery-person-name">
                      {order.deliveryPerson.name}
                    </h4>
                    <p className="delivery-person-phone">
                      {order.deliveryPerson.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
