import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Dummy authentication
      if (email === "user@example.com" && password === "password") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            role: "user",
            address: "123 Main St, City",
            phone: "+1 234 567 8900",
          })
        );
        navigate("/");
      } else if (
        email === "restaurant@example.com" &&
        password === "password"
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "2",
            name: "Pizza Palace",
            email: "restaurant@example.com",
            role: "restaurant",
            address: "456 Restaurant Ave, City",
            phone: "+1 234 567 8901",
            cuisine: "Italian",
            rating: 4.5,
          })
        );
        navigate("/restaurant/dashboard");
      } else if (email === "delivery@example.com" && password === "password") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "3",
            name: "Delivery Person",
            email: "delivery@example.com",
            role: "delivery",
            phone: "+1 234 567 8902",
            status: "available",
            vehicle: "Bicycle",
          })
        );
        navigate("/delivery/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Sign In"}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Accounts:</h3>
          <div className="credential-card">
            <p>
              <strong>Customer:</strong> user@example.com / password
            </p>
            <p>
              <strong>Restaurant:</strong> restaurant@example.com / password
            </p>
            <p>
              <strong>Delivery:</strong> delivery@example.com / password
            </p>
          </div>
        </div>

        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
