import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant }) => {
  const { name, cuisineType, rating, deliveryTime, image } = restaurant;

  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <img src={image} alt={name} />
      </div>
      <div className="restaurant-info">
        <h3>{name}</h3>
        <p className="cuisine-type">{cuisineType}</p>
        <div className="restaurant-details">
          <span className="rating">
            <i className="fas fa-star"></i> {rating}
          </span>
          <span className="delivery-time">
            <i className="fas fa-clock"></i> {deliveryTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
