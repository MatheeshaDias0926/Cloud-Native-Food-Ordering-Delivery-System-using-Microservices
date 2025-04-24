import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to Food Delivery</h1>
      {user ? (
        <p>Hello, {user.name}! Ready to order some delicious food?</p>
      ) : (
        <p>Please login or register to start ordering</p>
      )}
    </div>
  );
};

export default HomePage;
