import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.getRestaurants();
        setRestaurants(response.data.data || []);
      } catch (err) {
        setError("Failed to load restaurants");
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesCuisine =
      !cuisineFilter || restaurant.cuisineType === cuisineFilter;
    return matchesSearch && matchesCuisine;
  });

  const cuisineTypes = [
    ...new Set(
      restaurants.map((restaurant) => restaurant.cuisineType).filter(Boolean)
    ),
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="restaurant-list-container">
      <div className="restaurant-list-header">
        <h1 className="restaurant-list-title">Restaurants</h1>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="cuisine-select"
          >
            <option value="">All Cuisines</option>
            {cuisineTypes.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="restaurant-grid">
        {filteredRestaurants.map((restaurant) => (
          <Link
            key={restaurant._id}
            to={`/restaurants/${restaurant._id}`}
            className="restaurant-card"
          >
            <div className="restaurant-image-container">
              <img
                src={restaurant.image || "https://via.placeholder.com/400x300"}
                alt={restaurant.name || "Restaurant"}
                className="restaurant-image"
              />
            </div>
            <div className="restaurant-info">
              <h2 className="restaurant-name">
                {restaurant.name || "Unnamed Restaurant"}
              </h2>
              <p className="restaurant-cuisine">
                {restaurant.cuisineType || "Various cuisines"}
              </p>
              <div className="restaurant-meta">
                <div className="rating-container">
                  <svg
                    className="star-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {restaurant.rating ? restaurant.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
                <span>
                  {restaurant.deliveryTime
                    ? `${restaurant.deliveryTime} min`
                    : "N/A"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
