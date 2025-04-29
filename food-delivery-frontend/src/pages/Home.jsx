import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [featuredRestaurants] = useState([
    {
      _id: "1",
      name: "Pizza Palace",
      description: "Best pizza in town with authentic Italian flavors",
      address: "123 Pizza Street",
      cuisineType: "Italian",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      deliveryTime: 30,
      rating: 4.5,
      menu: [
        {
          _id: "101",
          name: "Margherita Pizza",
          description: "Classic pizza with tomato and mozzarella",
          price: 12.99,
          category: "Pizza",
          image:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          _id: "102",
          name: "Pepperoni Pizza",
          description: "Pizza with pepperoni and extra cheese",
          price: 14.99,
          category: "Pizza",
          image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
    },
    {
      _id: "2",
      name: "Burger House",
      description: "Juicy burgers and crispy fries",
      address: "456 Burger Avenue",
      cuisineType: "American",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      deliveryTime: 25,
      rating: 4.2,
      menu: [
        {
          _id: "201",
          name: "Classic Burger",
          description: "Beef patty with lettuce, tomato, and special sauce",
          price: 8.99,
          category: "Burgers",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          _id: "202",
          name: "Cheese Burger",
          description: "Classic burger with melted cheese",
          price: 9.99,
          category: "Burgers",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
    },
  ]);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total);
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMenuModal(true);
    setSelectedCategory("All");
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
    setSelectedRestaurant(null);
    setSelectedCategory("All");
  };

  const addToCart = (item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({
        ...item,
        quantity: 1,
        restaurantName: selectedRestaurant.name,
        restaurantId: selectedRestaurant._id,
      });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const categories = selectedRestaurant
    ? [
        "All",
        ...Array.from(
          new Set(selectedRestaurant.menu.map((item) => item.category))
        ),
      ]
    : [];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food Delivered To Your Doorstep
          </h1>
          <p className="hero-description">
            Order from your favorite restaurants and get it delivered in
            minutes. Fast, reliable, and delicious food delivery service.
          </p>
          <div className="hero-actions">
            <Link to="/restaurants" className="hero-button primary">
              Browse Restaurants
            </Link>
            <Link to="/cart" className="hero-button secondary">
              View Cart
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-restaurants">
        <div className="section-header">
          <h2 className="section-title">Featured Restaurants</h2>
          <p className="section-subtitle">
            Discover the best restaurants in your area
          </p>
        </div>
        <div className="restaurant-grid">
          {featuredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="restaurant-card"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className="restaurant-image-container">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                <div className="restaurant-rating">
                  <span>{restaurant.rating}</span>
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
                </div>
              </div>
              <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <p className="restaurant-cuisine">{restaurant.cuisineType}</p>
                <div className="restaurant-meta">
                  <span className="delivery-time">
                    {restaurant.deliveryTime} min
                  </span>
                  <span className="delivery-fee">Free delivery</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showMenuModal && selectedRestaurant && (
        <div className="menu-modal-overlay" onClick={closeMenuModal}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="menu-modal-header">
              <div className="restaurant-header">
                <img
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="modal-restaurant-image"
                />
                <div className="restaurant-header-info">
                  <h2 className="modal-restaurant-name">
                    {selectedRestaurant.name}
                  </h2>
                  <p className="modal-restaurant-description">
                    {selectedRestaurant.description}
                  </p>
                  <div className="modal-restaurant-meta">
                    <span className="rating">
                      {selectedRestaurant.rating} ★
                    </span>
                    <span className="delivery-time">
                      {selectedRestaurant.deliveryTime} min
                    </span>
                  </div>
                </div>
              </div>
              <button className="close-modal" onClick={closeMenuModal}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="menu-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-button ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="menu-items">
              {selectedRestaurant.menu
                .filter(
                  (item) =>
                    selectedCategory === "All" ||
                    item.category === selectedCategory
                )
                .map((item) => (
                  <div key={item._id} className="menu-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="menu-item-image"
                    />
                    <div className="menu-item-info">
                      <h3 className="menu-item-name">{item.name}</h3>
                      <p className="menu-item-description">
                        {item.description}
                      </p>
                      <div className="menu-item-footer">
                        <span className="menu-item-price">
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          className="add-to-cart-button"
                          onClick={() => addToCart(item)}
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
      )}

      {cart.length > 0 && (
        <div className="cart-summary">
          <div className="cart-header">
            <h3>Your Cart ({cart.length} items)</h3>
            <button
              onClick={() => navigate("/cart")}
              className="view-cart-button"
            >
              View Cart
            </button>
          </div>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>{item.restaurantName}</p>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="remove-item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
