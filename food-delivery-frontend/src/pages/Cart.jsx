import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useCart from "../hooks/useCart";
import { createOrder } from "../services/orders";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const cartItems = cart?.items || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order data
      const orderData = {
        restaurant: cart.restaurant._id,
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getCartTotal() + 5, // Including delivery fee
        deliveryFee: 5,
        status: "pending",
        deliveryAddress: deliveryAddress.trim(),
      };

      // Create the order
      const response = await createOrder(orderData);

      // Clear the cart after successful order creation
      clearCart();

      // Navigate to order confirmation page
      navigate(`/orders/${response.data._id}`);
    } catch (err) {
      console.error("Error creating order:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="empty-cart">
            <svg
              className="empty-cart-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-text">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/restaurants")}
              className="browse-restaurants-button"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          {cart.restaurant && (
            <div className="restaurant-info">
              <h2>{cart.restaurant.name}</h2>
              <p>{cart.restaurant.cuisineType}</p>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image || "https://via.placeholder.com/100x100"}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-restaurant">
                  {cart.restaurant?.name || "Unknown Restaurant"}
                </p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() =>
                      updateQuantity(item._id, Math.max(0, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span className="quantity-input">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </div>
              <button
                className="remove-button"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="delivery-address">
          <h3>Delivery Address</h3>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="address-input"
            rows={3}
          />
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Delivery Fee</span>
            <span className="summary-value">$5.00</span>
          </div>
          <div className="summary-row total">
            <span className="summary-label">Total</span>
            <span className="summary-value">
              ${(getCartTotal() + 5).toFixed(2)}
            </span>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
