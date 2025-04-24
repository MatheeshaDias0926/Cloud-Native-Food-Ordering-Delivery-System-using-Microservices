import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../../services/restaurants";
import MenuItem from "./MenuItem";
import "./MenuList.css";

const MenuList = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-list">
      <h2>{restaurant.name}'s Menu</h2>
      <div className="menu-items">
        {restaurant.menuItems?.map((item) => (
          <MenuItem key={item._id} item={item} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
