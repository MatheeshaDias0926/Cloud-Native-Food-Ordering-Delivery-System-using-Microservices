import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import api from "../services/api";
import "./RestaurantDetail.css";

const RestaurantDetail = () => {
  const { id } = useParams();
  const cart = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addToCartMessage, setAddToCartMessage] = useState("");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [restaurantResponse, menuResponse] = await Promise.all([
          api.getRestaurantById(id),
          api.getMenuItems(id),
        ]);
        setRestaurant(restaurantResponse.data.data);
        setMenuItems(menuResponse.data.data || []);
      } catch (err) {
        setError("Failed to load restaurant data");
        console.error("Error fetching restaurant data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleAddToCart = (item) => {
    try {
      // Validate item data
      if (!item || !item._id || !item.name || !item.price) {
        throw new Error("Invalid item data");
      }

      // Add restaurant info to the item
      const cartItem = {
        ...item,
        restaurantName: restaurant?.name || "Unknown Restaurant",
        restaurantId: restaurant?._id,
      };

      cart.addToCart(cartItem);
      setAddToCartMessage(`${item.name} added to cart!`);
      setTimeout(() => setAddToCartMessage(""), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setAddToCartMessage("Failed to add item to cart");
      setTimeout(() => setAddToCartMessage(""), 2000);
    }
  };

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredMenuItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="error-message">{error || "Restaurant not found"}</div>
    );
  }

  return (
    <div className="restaurant-detail-container">
      {addToCartMessage && (
        <div className="add-to-cart-message">{addToCartMessage}</div>
      )}
      <div
        className="restaurant-header"
        style={{
          backgroundImage: `url(${
            restaurant.image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80"
          })`,
        }}
      >
        <div className="restaurant-header-content">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <div className="restaurant-meta">
            <div className="meta-item">
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
              <span>
                {restaurant.rating ? restaurant.rating.toFixed(1) : "N/A"}
              </span>
            </div>
            <div className="meta-item">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {restaurant.deliveryTime
                  ? `${restaurant.deliveryTime} min`
                  : "N/A"}
              </span>
            </div>
            <div className="meta-item">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{restaurant.address || "Address not available"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-container">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredMenuItems.map((item) => (
            <div key={item._id} className="menu-item">
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80"
                }
                alt={item.name}
                className="menu-item-image"
              />
              <div className="menu-item-content">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <div className="menu-item-footer">
                  <span className="menu-item-price">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
