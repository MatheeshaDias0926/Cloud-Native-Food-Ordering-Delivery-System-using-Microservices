import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartList from "../components/orders/CartList";
import "./CartPage.css";

const CartPage = () => {
  const { cart } = useContext(CartContext);

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
      <div className="cart-actions">
        <Link to="/orders" className="checkout-button">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
