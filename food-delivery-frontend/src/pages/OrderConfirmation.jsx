import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orders";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-confirmation-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-container">
        <div className="error-message">{error || "Order not found"}</div>
        <button onClick={() => navigate("/orders")} className="back-button">
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-content">
        <div className="success-message">
          <svg
            className="success-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1>Order Confirmed!</h1>
          <p>Your order has been successfully placed.</p>
        </div>

        <div className="order-details">
          <h2>Order Details</h2>
          <div className="order-info">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${order.status}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </p>
            <p>
              <strong>Restaurant:</strong> {order.restaurant.name}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="order-items">
            <h3>Items</h3>
            {order.items.map((item) => (
              <div key={item._id} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${(order.totalAmount - order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <button
            onClick={() => navigate("/orders")}
            className="view-orders-button"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate("/restaurants")}
            className="continue-shopping-button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
