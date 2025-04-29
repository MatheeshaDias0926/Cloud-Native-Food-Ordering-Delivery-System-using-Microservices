import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>
        <div className="order-details">
          <h2>Order Details</h2>
          <p>Order Number: #{Math.floor(Math.random() * 1000000)}</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="success-actions">
          <button onClick={() => navigate("/")} className="continue-shopping">
            Continue Shopping
          </button>
          <button onClick={() => navigate("/orders")} className="view-orders">
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
