import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartList from "../components/orders/CartList";
import { createOrder } from "../services/orders";
import "./CartPage.css";

const CartPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order data
      const orderData = {
        restaurant: cart.restaurant._id,
        items: cart.items.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress: "123 Main St, City, Country", // This should come from user profile or form
        paymentMethod: "card", // This should come from user selection
      };

      // Create the order
      const response = await createOrder(orderData);

      // Clear the cart after successful order creation
      clearCart();

      // Navigate to orders page
      navigate("/orders");
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/restaurants" className="browse-restaurants">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="restaurant-info">
        <h2>{cart.restaurant.name}</h2>
        <p>{cart.restaurant.cuisineType}</p>
      </div>
      <CartList />
      {error && <div className="error-message">{error}</div>}
      <div className="cart-actions">
        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
