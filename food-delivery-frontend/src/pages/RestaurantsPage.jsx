import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RestaurantList from "../components/restaurants/RestaurantList";
import { getRestaurants } from "../services/restaurants";
import "./RestaurantsPage.css";

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load restaurants. Please try again later.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurants-page">
      <h1>Restaurants</h1>
      <RestaurantList restaurants={restaurants} />
    </div>
  );
};

export default RestaurantsPage;
