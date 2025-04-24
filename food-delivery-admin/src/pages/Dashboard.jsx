import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as OrderIcon,
  LocalShipping as DeliveryIcon,
} from "@mui/icons-material";
import { fetchUsers } from "../store/slices/usersSlice";
import { fetchRestaurants } from "../store/slices/restaurantsSlice";
import { fetchOrders } from "../store/slices/ordersSlice";
import { fetchDeliveries } from "../store/slices/deliveriesSlice";

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
    <Box
      sx={{
        backgroundColor: `${color}15`,
        borderRadius: "50%",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { restaurants, loading: restaurantsLoading } = useSelector(
    (state) => state.restaurants
  );
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { deliveries, loading: deliveriesLoading } = useSelector(
    (state) => state.deliveries
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRestaurants());
    dispatch(fetchOrders());
    dispatch(fetchDeliveries());
  }, [dispatch]);

  const loading =
    usersLoading || restaurantsLoading || ordersLoading || deliveriesLoading;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={users?.length || 0}
            icon={<PeopleIcon sx={{ color: "#1976d2" }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Restaurants"
            value={restaurants?.length || 0}
            icon={<RestaurantIcon sx={{ color: "#2e7d32" }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={orders?.length || 0}
            icon={<OrderIcon sx={{ color: "#ed6c02" }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Deliveries"
            value={deliveries?.length || 0}
            icon={<DeliveryIcon sx={{ color: "#9c27b0" }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
