import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";

// Layout Components
import Layout from "./components/layout/Layout";

// Page Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import MenuItems from "./pages/MenuItems";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role-based route protection
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Theme configuration
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
});

// Create router with future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Admin-only routes */}
        <Route
          path="users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Users />
            </RoleBasedRoute>
          }
        />
        <Route
          path="restaurants"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Restaurants />
            </RoleBasedRoute>
          }
        />
        <Route
          path="deliveries"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Deliveries />
            </RoleBasedRoute>
          }
        />

        {/* Restaurant owner routes */}
        <Route
          path="menu"
          element={
            <RoleBasedRoute allowedRoles={["restaurant"]}>
              <MenuItems />
            </RoleBasedRoute>
          }
        />

        {/* Shared routes */}
        <Route path="orders" element={<Orders />} />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
