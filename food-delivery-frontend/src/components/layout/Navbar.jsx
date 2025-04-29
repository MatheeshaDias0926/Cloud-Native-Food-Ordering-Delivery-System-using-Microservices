import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeliveryStatus, setShowDeliveryStatus] = useState(false);
  const [brandName, setBrandName] = useState("FoodieExpress");
  const user = { name: "Sadan" }; // This would typically come from your auth context/state

  // Animate brand name on hover
  const handleBrandHover = () => {
    const names = ["FoodieExpress", "QuickBites", "TastyDash", "FlavorFly"];
    let currentIndex = names.indexOf(brandName);
    let nextIndex = (currentIndex + 1) % names.length;
    setBrandName(names[nextIndex]);
  };

  // Dummy delivery status data
  const deliveryStatus = {
    driver: {
      name: "John Doe",
      rating: 4.8,
      phone: "+1 234-567-8900",
      vehicle: "Honda Civic",
      plateNumber: "ABC123",
    },
    order: {
      id: "ORD-12345",
      status: "On the way",
      estimatedTime: "10-15 min",
      currentLocation: "2.5 miles away",
    },
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onMouseEnter={handleBrandHover}>
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand-name">{brandName}</span>
            <span className="brand-tagline">Delicious Delivered</span>
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/restaurants" className="nav-link">
            <svg
              className="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M3 12h18M3 6h18M3 18h18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Restaurants</span>
          </Link>
          <Link to="/cart" className="nav-link">
            <svg
              className="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zM3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Cart</span>
          </Link>
          <Link to="/orders" className="nav-link">
            <svg
              className="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Orders</span>
          </Link>
          <button
            className="nav-link delivery-status-button"
            onClick={() => setShowDeliveryStatus(true)}
          >
            <svg
              className="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Delivery Status</span>
          </button>
          <div className="user-menu-container">
            <button
              className="user-menu-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="user-name">{user.name}</span>
              <svg
                className={`dropdown-icon ${showUserMenu ? "open" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Profile</span>
                </Link>
                <Link to="/orders" onClick={() => setShowUserMenu(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>My Orders</span>
                </Link>
                <button
                  className="logout-button"
                  onClick={() => {
                    // Handle logout here
                    setShowUserMenu(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Delivery Status Modal */}
      {showDeliveryStatus && (
        <div
          className="delivery-status-modal-overlay"
          onClick={() => setShowDeliveryStatus(false)}
        >
          <div
            className="delivery-status-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delivery-status-header">
              <h2>Delivery Status</h2>
              <button
                className="close-modal"
                onClick={() => setShowDeliveryStatus(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="delivery-status-content">
              <div className="order-status">
                <div className="status-badge">
                  {deliveryStatus.order.status}
                </div>
                <p className="estimated-time">
                  Estimated arrival: {deliveryStatus.order.estimatedTime}
                </p>
                <p className="current-location">
                  {deliveryStatus.order.currentLocation}
                </p>
              </div>

              <div className="driver-info">
                <div className="driver-header">
                  <div className="driver-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="driver-details">
                    <h3>{deliveryStatus.driver.name}</h3>
                    <div className="driver-rating">
                      <span>{deliveryStatus.driver.rating}</span>
                      <svg
                        className="star-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="driver-vehicle">
                  <p>
                    <strong>Vehicle:</strong> {deliveryStatus.driver.vehicle}
                  </p>
                  <p>
                    <strong>Plate Number:</strong>{" "}
                    {deliveryStatus.driver.plateNumber}
                  </p>
                </div>

                <div className="driver-contact">
                  <button className="contact-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Call Driver
                  </button>
                </div>
              </div>

              <div className="order-tracking">
                <div className="tracking-progress">
                  <div className="progress-step completed">
                    <div className="step-icon">✓</div>
                    <div className="step-label">Order Placed</div>
                  </div>
                  <div className="progress-step completed">
                    <div className="step-icon">✓</div>
                    <div className="step-label">Preparing</div>
                  </div>
                  <div className="progress-step active">
                    <div className="step-icon">●</div>
                    <div className="step-label">On the Way</div>
                  </div>
                  <div className="progress-step">
                    <div className="step-icon">○</div>
                    <div className="step-label">Delivered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
