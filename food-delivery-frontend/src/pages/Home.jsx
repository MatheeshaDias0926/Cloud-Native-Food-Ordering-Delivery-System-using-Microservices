import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../services/restaurants";
import "./Home.css";

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await getRestaurants();
        setFeaturedRestaurants(response.data || []);
      } catch (err) {
        setError("Failed to load featured restaurants");
        console.error("Error fetching featured restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

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
    <div>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food Delivered To Your Doorstep
          </h1>
          <p className="hero-description">
            Order from your favorite restaurants and get it delivered in
            minutes. Fast, reliable, and delicious food delivery service.
          </p>
          <Link
            to="/restaurants"
            className="hero-button bg-blue-500 text-white"
          >
            Browse Restaurants
          </Link>
        </div>
      </section>

      <section className="featured-restaurants">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Featured Restaurants</h2>
          <div className="restaurant-grid">
            {featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="restaurant-card"
              >
                <img
                  src={
                    restaurant.image || "https://via.placeholder.com/400x300"
                  }
                  alt={restaurant.name || "Restaurant"}
                  className="restaurant-image"
                />
                <div className="restaurant-info">
                  <h3 className="restaurant-name">
                    {restaurant.name || "Unnamed Restaurant"}
                  </h3>
                  <p className="restaurant-cuisine">
                    {restaurant.cuisineType || "Various cuisines"}
                  </p>
                  <div className="restaurant-meta">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">
                        {restaurant.rating
                          ? restaurant.rating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
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
      </section>

      <section className="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="features-grid">
            <div className="feature-card">
              <svg
                className="feature-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Get your food delivered in minutes with our fast and reliable
                delivery service.
              </p>
            </div>
            <div className="feature-card">
              <svg
                className="feature-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-description">
                Pay securely with multiple payment options available.
              </p>
            </div>
            <div className="feature-card">
              <svg
                className="feature-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h3 className="feature-title">Best Quality</h3>
              <p className="feature-description">
                Enjoy the best quality food from top-rated restaurants.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
