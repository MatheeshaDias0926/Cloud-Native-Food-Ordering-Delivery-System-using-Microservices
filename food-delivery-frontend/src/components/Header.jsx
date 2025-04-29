import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
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

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrdersCount(savedOrders.length);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>FoodExpress</h1>
          </Link>
        </div>

        <nav className="main-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/restaurants" className="nav-link">
            Restaurants
          </Link>
          <Link to="/orders" className="nav-link orders-link">
            Orders
            {ordersCount > 0 && (
              <span className="orders-badge">{ordersCount}</span>
            )}
          </Link>
        </nav>

        <div className="header-actions">
          <div className="notifications-wrapper">
            <button
              className="notifications-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button
                    className="close-notifications"
                    onClick={() => setShowNotifications(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? "read" : ""
                      }`}
                    >
                      <div className="notification-content">
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                      {!notification.read && (
                        <div className="notification-dot"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="cart-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
