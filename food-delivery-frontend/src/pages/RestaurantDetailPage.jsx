import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../services/restaurants";
import MenuList from "../components/menu/MenuList";
import "./RestaurantDetailPage.css";

const RestaurantDetailPage = () => {
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
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-header">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.cuisineType}</p>
        <p>{restaurant.address}</p>
      </div>
      <MenuList restaurantId={id} />
    </div>
  );
};

export default RestaurantDetailPage;
