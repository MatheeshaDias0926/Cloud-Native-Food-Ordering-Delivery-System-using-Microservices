import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import RestaurantManagement from "./pages/RestaurantManagement";
import DeliveryManagement from "./pages/DeliveryManagement";
import AdminDashboard from "./pages/AdminDashboard";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import ServiceDashboard from "./pages/ServiceDashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />

            {/* Protected Routes - Customer */}
            <Route
              path="/cart"
              element={
                <RoleBasedRoute allowedRoles={["customer"]}>
                  <Cart />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <RoleBasedRoute allowedRoles={["customer"]}>
                  <Checkout />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <RoleBasedRoute allowedRoles={["customer"]}>
                  <OrderHistory />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleBasedRoute allowedRoles={["customer"]}>
                  <Profile />
                </RoleBasedRoute>
              }
            />

            {/* Protected Routes - Restaurant Admin */}
            <Route
              path="/restaurant-management"
              element={
                <RoleBasedRoute allowedRoles={["restaurant_admin"]}>
                  <RestaurantManagement />
                </RoleBasedRoute>
              }
            />

            {/* Protected Routes - Delivery Personnel */}
            <Route
              path="/delivery-management"
              element={
                <RoleBasedRoute allowedRoles={["delivery_personnel"]}>
                  <DeliveryManagement />
                </RoleBasedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/admin/services"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <ServiceDashboard />
                </RoleBasedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
