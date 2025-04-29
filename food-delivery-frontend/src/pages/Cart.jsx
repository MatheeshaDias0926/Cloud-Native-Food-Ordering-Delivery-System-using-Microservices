import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    // Navigate to payment page
    navigate("/payment");
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button
          onClick={() => navigate("/restaurants")}
          className="browse-button"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.restaurantName}</p>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-item"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-section">
          <h2>Checkout</h2>
          <div className="delivery-address">
            <h3>Delivery Address</h3>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              required
            />
          </div>
          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Credit/Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                PayPal
              </label>
            </div>
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Delivery Fee</span>
              <span>$2.99</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${(cartTotal + 2.99).toFixed(2)}</span>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            className="place-order-button"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
