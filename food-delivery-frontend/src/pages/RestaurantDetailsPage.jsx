import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MenuList from "../components/restaurants/MenuList";
import "./RestaurantDetailsPage.css";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await getRestaurantDetails(id);
        // setRestaurant(response.data);

        // Temporary mock data
        const mockRestaurants = {
          1: {
            _id: "1",
            name: "Pizza Place",
            cuisineType: "Italian",
            rating: 4.5,
            deliveryTime: "30-45 min",
            image:
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
            description: "Authentic Italian pizza and pasta",
            menu: [
              {
                _id: "1",
                name: "Margherita Pizza",
                description: "Fresh tomatoes, mozzarella, and basil",
                price: 12.99,
                image:
                  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
              },
              {
                _id: "2",
                name: "Pepperoni Pizza",
                description: "Classic pepperoni with cheese",
                price: 14.99,
                image:
                  "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
              },
              {
                _id: "3",
                name: "Pasta Carbonara",
                description: "Creamy pasta with bacon and egg",
                price: 13.99,
                image:
                  "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop",
              },
            ],
          },
          2: {
            _id: "2",
            name: "Burger Joint",
            cuisineType: "American",
            rating: 4.2,
            deliveryTime: "25-40 min",
            image:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
            description: "Juicy burgers and fresh fries",
            menu: [
              {
                _id: "1",
                name: "Classic Burger",
                description: "Beef patty with lettuce, tomato, and cheese",
                price: 9.99,
                image:
                  "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=300&h=200&fit=crop",
              },
              {
                _id: "2",
                name: "Double Cheese Burger",
                description: "Double patty with extra cheese",
                price: 12.99,
                image:
                  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop",
              },
              {
                _id: "3",
                name: "Chicken Burger",
                description: "Grilled chicken with special sauce",
                price: 10.99,
                image:
                  "https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop",
              },
            ],
          },
          3: {
            _id: "3",
            name: "Sushi Bar",
            cuisineType: "Japanese",
            rating: 4.7,
            deliveryTime: "35-50 min",
            image:
              "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop",
            description: "Fresh and authentic Japanese cuisine",
            menu: [
              {
                _id: "1",
                name: "California Roll",
                description: "Crab, avocado, and cucumber",
                price: 8.99,
                image:
                  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop",
              },
              {
                _id: "2",
                name: "Salmon Nigiri",
                description: "Fresh salmon over rice",
                price: 7.99,
                image:
                  "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
              },
              {
                _id: "3",
                name: "Dragon Roll",
                description: "Eel and avocado roll",
                price: 13.99,
                image:
                  "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&h=200&fit=crop",
              },
            ],
          },
        };

        const restaurantData = mockRestaurants[id];
        if (restaurantData) {
          setRestaurant(restaurantData);
        } else {
          setError("Restaurant not found");
        }
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
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="cuisine-type">{restaurant.cuisineType}</p>
          <div className="restaurant-meta">
            <span className="rating">⭐ {restaurant.rating}</span>
            <span className="delivery-time">🕒 {restaurant.deliveryTime}</span>
          </div>
          <p className="description">{restaurant.description}</p>
        </div>
      </div>
      <div className="menu-section">
        <h2>Menu</h2>
        <MenuList menu={restaurant.menu} restaurantId={restaurant._id} />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
