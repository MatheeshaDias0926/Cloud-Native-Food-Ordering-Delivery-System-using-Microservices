import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./MenuItem.css";

const MenuItem = ({ item, restaurant }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="menu-item">
      <div className="item-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="price">${item.price.toFixed(2)}</p>
      </div>
      <button
        onClick={() => addToCart(item, restaurant)}
        className="add-to-cart"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MenuItem;
