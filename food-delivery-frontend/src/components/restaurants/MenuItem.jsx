import "./MenuItem.css";

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item">
      <img
        src={item.image || "https://via.placeholder.com/300x200"}
        alt={item.name}
        className="menu-item-image"
      />
      <div className="menu-item-content">
        <h3>{item.name}</h3>
        <p className="description">
          {item.description || "No description available"}
        </p>
        <div className="menu-item-footer">
          <span className="price">${(item.price || 0).toFixed(2)}</span>
          <button onClick={onAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
