import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Restaurant,
  LocalShipping,
  Payment,
  Notifications,
  ShoppingCart,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";

const ServiceDashboard = () => {
  const { isAdmin } = useAuth();
  const api = useApi();
  const [activeTab, setActiveTab] = useState(0);
  const [services, setServices] = useState({
    restaurants: [],
    orders: [],
    deliveries: [],
    payments: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all service data
  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const [restaurants, orders, deliveries, payments, notifications] =
        await Promise.all([
          api.get("/api/restaurants"),
          api.get("/api/orders"),
          api.get("/api/deliveries"),
          api.get("/api/payments"),
          api.get("/api/notifications"),
        ]);

      setServices({
        restaurants: restaurants.data,
        orders: orders.data,
        deliveries: deliveries.data,
        payments: payments.data,
        notifications: notifications.data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDialogOpen = (service, data = {}) => {
    setSelectedService(service);
    setFormData(data);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedService(null);
    setFormData({});
  };

  const handleFormSubmit = async () => {
    try {
      if (selectedService) {
        const endpoint = `/api/${selectedService}`;
        if (formData.id) {
          await api.put(`${endpoint}/${formData.id}`, formData);
        } else {
          await api.post(endpoint, formData);
        }
        fetchServiceData();
        handleDialogClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (service, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.del(`/api/${service}/${id}`);
        fetchServiceData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const renderServiceTable = (service, data) => {
    const columns = {
      restaurants: ["Name", "Cuisine", "Status", "Rating"],
      orders: ["Order ID", "Customer", "Total", "Status"],
      deliveries: ["Delivery ID", "Order ID", "Status", "ETA"],
      payments: ["Payment ID", "Order ID", "Amount", "Status"],
      notifications: ["Type", "Recipient", "Message", "Status"],
    };

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns[service].map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns[service].map((column) => (
                  <TableCell key={column}>
                    {item[column.toLowerCase().replace(/\s+/g, "_")]}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    onClick={() => handleDialogOpen(service, item)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(service, item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderServiceContent = () => {
    const serviceData = {
      restaurants: services.restaurants,
      orders: services.orders,
      deliveries: services.deliveries,
      payments: services.payments,
      notifications: services.notifications,
    };

    return (
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">
            {activeTab === 0 && "Restaurants"}
            {activeTab === 1 && "Orders"}
            {activeTab === 2 && "Deliveries"}
            {activeTab === 3 && "Payments"}
            {activeTab === 4 && "Notifications"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              handleDialogOpen(
                activeTab === 0
                  ? "restaurants"
                  : activeTab === 1
                  ? "orders"
                  : activeTab === 2
                  ? "deliveries"
                  : activeTab === 3
                  ? "payments"
                  : "notifications"
              )
            }
          >
            Add New
          </Button>
        </Box>
        {renderServiceTable(
          activeTab === 0
            ? "restaurants"
            : activeTab === 1
            ? "orders"
            : activeTab === 2
            ? "deliveries"
            : activeTab === 3
            ? "payments"
            : "notifications",
          serviceData[
            activeTab === 0
              ? "restaurants"
              : activeTab === 1
              ? "orders"
              : activeTab === 2
              ? "deliveries"
              : activeTab === 3
              ? "payments"
              : "notifications"
          ]
        )}
      </Box>
    );
  };

  if (!isAdmin()) {
    return (
      <Container>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Service Dashboard
              </Typography>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab
                  icon={<Restaurant />}
                  label="Restaurants"
                  iconPosition="start"
                />
                <Tab
                  icon={<ShoppingCart />}
                  label="Orders"
                  iconPosition="start"
                />
                <Tab
                  icon={<LocalShipping />}
                  label="Deliveries"
                  iconPosition="start"
                />
                <Tab icon={<Payment />} label="Payments" iconPosition="start" />
                <Tab
                  icon={<Notifications />}
                  label="Notifications"
                  iconPosition="start"
                />
              </Tabs>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              ) : (
                renderServiceContent()
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {formData.id ? "Edit" : "Add New"} {selectedService}
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box sx={{ mt: 2 }}>
              {Object.keys(formData).map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {formData.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceDashboard;
