import React, { useState } from "react";
import "./Orders.css";

const Orders = () => {
  const [orders] = useState([
    {
      id: "ORD-001",
      restaurant: "Pizza Palace",
      status: "Delivered",
      date: "2024-03-15",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 12.99 },
        { name: "Garlic Bread", quantity: 2, price: 4.99 },
      ],
      total: 22.97,
    },
    {
      id: "ORD-002",
      restaurant: "Burger House",
      status: "In Transit",
      date: "2024-03-16",
      items: [
        { name: "Classic Burger", quantity: 2, price: 8.99 },
        { name: "French Fries", quantity: 1, price: 3.99 },
      ],
      total: 21.97,
    },
    {
      id: "ORD-003",
      restaurant: "Sushi Master",
      status: "Preparing",
      date: "2024-03-17",
      items: [
        { name: "California Roll", quantity: 1, price: 10.99 },
        { name: "Salmon Nigiri", quantity: 2, price: 12.99 },
      ],
      total: 36.97,
    },
  ]);

  const [notifications] = useState([
    {
      id: 1,
      message: "Your order ORD-002 is on its way!",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "Order ORD-001 has been delivered successfully.",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 3,
      message: "New deals available at Pizza Palace!",
      time: "1 day ago",
      read: true,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "status-delivered";
      case "in transit":
        return "status-transit";
      case "preparing":
        return "status-preparing";
      default:
        return "";
    }
  };

  return (
    <div className="orders-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="notifications-badge">
          {notifications.filter((n) => !n.read).length}
        </div>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? "read" : ""}`}
          >
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {!notification.read && <div className="notification-dot"></div>}
          </div>
        ))}
      </div>

      <h2 className="orders-title">Your Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3 className="order-id">Order #{order.id}</h3>
                <p className="order-date">{order.date}</p>
              </div>
              <div className={`order-status ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>

            <div className="order-restaurant">{order.restaurant}</div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span className="item-name">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                Total: <span>${order.total.toFixed(2)}</span>
              </div>
              <button className="reorder-button">Reorder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
