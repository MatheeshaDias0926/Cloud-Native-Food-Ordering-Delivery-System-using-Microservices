import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import MenuItem from "./MenuItem";
import "./MenuList.css";

const MenuList = ({ menu, restaurantId }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    addToCart({ ...item, restaurantId });
  };

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
