import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RestaurantList from "../components/restaurants/RestaurantList";
import "./RestaurantsPage.css";

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await getRestaurants();
        // setRestaurants(response.data);

        // Temporary mock data with reliable placeholder images
        setRestaurants([
          {
            _id: "1",
            name: "Pizza Place",
            cuisineType: "Italian",
            rating: 4.5,
            deliveryTime: "30-45 min",
            image:
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
          },
          {
            _id: "2",
            name: "Burger Joint",
            cuisineType: "American",
            rating: 4.2,
            deliveryTime: "25-40 min",
            image:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
          },
          {
            _id: "3",
            name: "Sushi Bar",
            cuisineType: "Japanese",
            rating: 4.7,
            deliveryTime: "35-50 min",
            image:
              "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop",
          },
        ]);
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
