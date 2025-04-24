import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import CartItem from "./CartItem";
import "./CartList.css";

const CartList = () => {
  const { cart } = useContext(CartContext);

  if (!cart.items || cart.items.length === 0) {
    return <div className="empty-cart">Your cart is empty.</div>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-list">
      <div className="cart-items">
        {cart.items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>
      <div className="cart-summary">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="delivery-fee">
          <span>Delivery Fee:</span>
          <span>$5.00</span>
        </div>
        <div className="total">
          <span>Total:</span>
          <span>${(total + 5).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartList;
