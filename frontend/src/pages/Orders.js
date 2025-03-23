import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/slices/orderSlice";

const orderStatuses = {
  pending: { label: "Pending", color: "warning" },
  confirmed: { label: "Confirmed", color: "info" },
  preparing: { label: "Preparing", color: "primary" },
  ready: { label: "Ready", color: "success" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === 0) return true; // All orders
    if (selectedTab === 1) return order.status === "pending";
    if (selectedTab === 2) return order.status === "delivered";
    return order.status === "cancelled";
  });

  const calculateOrderTotal = (order) => {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Orders" />
        <Tab label="Active Orders" />
        <Tab label="Completed Orders" />
        <Tab label="Cancelled Orders" />
      </Tabs>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : filteredOrders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order._id.slice(-6)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        label={orderStatuses[order.status].label}
                        color={orderStatuses[order.status].color}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleViewOrder(order)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      {order.items.map((item) => (
                        <Box key={item._id} sx={{ mb: 1 }}>
                          <Typography variant="body1">
                            {item.name} x {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.restaurantName}
                          </Typography>
                          {item.specialInstructions && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              Note: {item.specialInstructions}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" color="text.secondary">
                          Subtotal: ${calculateOrderTotal(order).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tax: ${(calculateOrderTotal(order) * 0.1).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Delivery Fee: $
                          {calculateOrderTotal(order) > 50 ? "0.00" : "5.00"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h6">
                          Total: ${order.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {order.status === "delivered" && !order.rating && (
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IconButton
                          key={star}
                          size="small"
                          onClick={() => {
                            // Handle rating submission
                          }}
                        >
                          <StarBorderIcon />
                        </IconButton>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - #{selectedOrder?._id.slice(-6)}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Status
                </Typography>
                <Chip
                  label={orderStatuses[selectedOrder.status].label}
                  color={orderStatuses[selectedOrder.status].color}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Delivery Address
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.deliveryAddress.street}
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.deliveryAddress.city},{" "}
                  {selectedOrder.deliveryAddress.state}{" "}
                  {selectedOrder.deliveryAddress.zipCode}
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.deliveryAddress.country}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Items
                </Typography>
                {selectedOrder.items.map((item) => (
                  <Box key={item._id} sx={{ mb: 1 }}>
                    <Typography variant="body1">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.restaurantName}
                    </Typography>
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    {item.specialInstructions && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        Note: {item.specialInstructions}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Details
                </Typography>
                <Typography variant="body2">
                  Method:{" "}
                  {selectedOrder.paymentMethod === "card"
                    ? "Credit/Debit Card"
                    : "Cash on Delivery"}
                </Typography>
                {selectedOrder.paymentMethod === "card" && (
                  <Typography variant="body2">
                    Card ending in {selectedOrder.cardDetails.number.slice(-4)}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
