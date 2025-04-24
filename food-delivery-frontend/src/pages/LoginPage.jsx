import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email, password, userType) => {
    try {
      setError("");
      const response = await login(email, password, userType);

      // Redirect based on user type
      switch (userType) {
        case "restaurant_owner":
          navigate("/restaurant/dashboard");
          break;
        case "delivery_person":
          navigate("/delivery/dashboard");
          break;
        default:
          navigate("/restaurants");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginForm onSubmit={handleLogin} error={error} />
        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
