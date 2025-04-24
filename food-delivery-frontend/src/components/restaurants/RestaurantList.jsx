import { Link } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import "./RestaurantList.css";

const RestaurantList = ({ restaurants }) => {
  if (!restaurants || restaurants.length === 0) {
    return <div className="no-restaurants">No restaurants found.</div>;
  }

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <Link
          to={`/restaurants/${restaurant._id}`}
          key={restaurant._id}
          className="restaurant-link"
        >
          <RestaurantCard restaurant={restaurant} />
        </Link>
      ))}
    </div>
  );
};

export default RestaurantList;
