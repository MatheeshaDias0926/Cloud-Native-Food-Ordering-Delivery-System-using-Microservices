import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item._id, newQuantity);
  };

  return (
    <div className="cart-item">
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="price">${item.price.toFixed(2)}</p>
      </div>
      <div className="item-actions">
        <div className="quantity-control">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="quantity-btn"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>
        <button onClick={() => removeFromCart(item._id)} className="remove-btn">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
