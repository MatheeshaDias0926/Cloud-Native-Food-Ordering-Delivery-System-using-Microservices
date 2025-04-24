import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store";
import Dashboard from "./pages/Dashboard";
import RestaurantMenu from "./pages/restaurant/Menu";
import RestaurantOrders from "./pages/restaurant/Orders";
import DeliveryOrders from "./pages/delivery/Orders";
import Profile from "./pages/Profile";
import { CircularProgress } from "@mui/material";

// Layout component to wrap all routes
const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Role-based Routes */}
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute allowedRoles={["restaurant"]}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
