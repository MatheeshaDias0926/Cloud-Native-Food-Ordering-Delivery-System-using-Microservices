import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantById, getMenuItems } from "../services/restaurants";
import MenuList from "../components/restaurants/MenuList";
import "./RestaurantDetailPage.css";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        // Fetch restaurant details
        const restaurantData = await getRestaurantById(id);
        setRestaurant(restaurantData.data);

        // Fetch menu items
        const menuData = await getMenuItems(id);
        setMenuItems(menuData.data || []);

        setLoading(false);
      } catch (err) {
        setError("Failed to load restaurant details. Please try again later.");
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (loading)
    return <div className="loading">Loading restaurant details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">Restaurant not found</div>;

  return (
    <div className="restaurant-details-page">
      <div className="restaurant-header">
        <img
          src={restaurant.image || "https://via.placeholder.com/300x200"}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="cuisine-type">{restaurant.cuisineType}</p>
          <div className="restaurant-meta">
            <span className="rating">⭐ {restaurant.rating || "N/A"}</span>
            <span className="delivery-time">
              🕒 {restaurant.deliveryTime || "30-45 min"}
            </span>
          </div>
          <p className="description">
            {restaurant.description || "No description available"}
          </p>
        </div>
      </div>
      <div className="menu-section">
        <h2>Menu</h2>
        <MenuList
          menu={menuItems}
          restaurantId={restaurant._id}
          restaurant={restaurant}
        />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
