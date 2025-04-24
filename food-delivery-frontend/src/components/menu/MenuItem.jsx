import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./MenuItem.css";

const MenuItem = ({ item, restaurant }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    if (!item || !restaurant) {
      console.error("Cannot add to cart: Missing item or restaurant data");
      return;
    }
    addToCart(item, restaurant);
  };

  return (
    <div className="menu-item">
      <div className="item-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="price">${item.price.toFixed(2)}</p>
      </div>
      <button onClick={handleAddToCart} className="add-to-cart">
        Add to Cart
      </button>
    </div>
  );
};

export default MenuItem;
