import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching order details from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const foundOrder = storedOrders.find((o) => o.id === orderId);
    setOrder(foundOrder);
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-not-found">
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/orders")} className="back-to-orders">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button onClick={() => navigate("/orders")} className="back-button">
          ← Back to Orders
        </button>
        <h1>Order #{order.id}</h1>
      </div>

      <div className="order-details-content">
        <div className="order-status-section">
          <h2>Order Status</h2>
          <div className="status-timeline">
            <div className="status-step completed">
              <div className="status-icon">✓</div>
              <div className="status-info">
                <h3>Order Placed</h3>
                <p>{new Date(order.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="status-step completed">
              <div className="status-icon">✓</div>
              <div className="status-info">
                <h3>Payment Confirmed</h3>
                <p>{new Date(order.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="status-step active">
              <div className="status-icon">●</div>
              <div className="status-info">
                <h3>Preparing</h3>
                <p>Your order is being prepared</p>
              </div>
            </div>
            <div className="status-step">
              <div className="status-icon">○</div>
              <div className="status-info">
                <h3>On the Way</h3>
                <p>Your order is on its way</p>
              </div>
            </div>
            <div className="status-step">
              <div className="status-icon">○</div>
              <div className="status-info">
                <h3>Delivered</h3>
                <p>Your order has been delivered</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-items-section">
          <h2>Order Items</h2>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                </div>
                <div className="order-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>$2.99</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(order.total + 2.99).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="delivery-info-section">
          <h2>Delivery Information</h2>
          <div className="delivery-details">
            <div className="delivery-address">
              <h3>Delivery Address</h3>
              <p>123 Main Street</p>
              <p>Apartment 4B</p>
              <p>New York, NY 10001</p>
            </div>
            <div className="delivery-contact">
              <h3>Contact Information</h3>
              <p>John Doe</p>
              <p>+1 (555) 123-4567</p>
              <p>john.doe@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
