import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, error: authError } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case "restaurant":
          navigate("/restaurant/dashboard");
          break;
        case "delivery":
          navigate("/delivery/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async (credentials) => {
    try {
      setError("");
      setLoading(true);
      await login(credentials);
      // Navigation will be handled by the useEffect above
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginForm onSubmit={handleLogin} error={error} />
        {loading && <div className="loading">Logging in...</div>}
        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
