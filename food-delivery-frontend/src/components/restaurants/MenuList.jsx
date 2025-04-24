import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import MenuItem from "./MenuItem";
import "./MenuList.css";

const MenuList = ({ menu, restaurantId, restaurant }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    if (!restaurant) {
      console.error("Cannot add to cart: Restaurant data is missing");
      return;
    }
    addToCart(item, restaurant);
  };

  if (!menu || menu.length === 0) {
    return <div className="no-menu-items">No menu items available.</div>;
  }

  return (
    <div className="menu-list">
      {menu.map((item) => (
        <MenuItem
          key={item._id}
          item={item}
          onAddToCart={() => handleAddToCart(item)}
        />
      ))}
    </div>
  );
};

export default MenuList;
