import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.getRestaurants();
        setRestaurants(response.data.data || []);
      } catch (err) {
        setError("Failed to load restaurants. Please try again later.");
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>
        {loading ? (
          <p>Loading restaurants...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-2">{restaurant.cuisineType}</p>
                <p className="text-gray-600 mb-4">{restaurant.address}</p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  View Menu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <p className="text-gray-600">No recent orders</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Favorite Restaurants</h2>
          <p className="text-gray-600">No favorite restaurants yet</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
