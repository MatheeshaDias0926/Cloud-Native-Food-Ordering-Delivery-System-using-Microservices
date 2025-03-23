import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantDetails,
  updateRestaurant,
} from "../store/slices/restaurantSlice";
import { fetchOrders } from "../store/slices/orderSlice";

const RestaurantManagement = () => {
  const dispatch = useDispatch();
  const { restaurant, loading } = useSelector((state) => state.restaurant);
  const { orders } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    description: "",
    cuisine: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    phone: "",
    email: "",
    openingHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
    features: [],
  });
  const [menuDialog, setMenuDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [menuItemData, setMenuItemData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchRestaurantDetails());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (restaurant) {
      setRestaurantData(restaurant);
    }
  }, [restaurant]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field) => (event) => {
    setRestaurantData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAddressChange = (field) => (event) => {
    setRestaurantData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: event.target.value,
      },
    }));
  };

  const handleOpeningHoursChange = (day, field) => (event) => {
    setRestaurantData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: event.target.value,
        },
      },
    }));
  };

  const handleFeatureToggle = (feature) => {
    setRestaurantData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSaveRestaurant = async () => {
    try {
      await dispatch(updateRestaurant(restaurantData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update restaurant:", error);
    }
  };

  const handleMenuItemChange = (field) => (event) => {
    setMenuItemData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMenuItemData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSaveMenuItem = async () => {
    try {
      // Handle menu item save logic here
      setMenuDialog(false);
      setSelectedMenuItem(null);
      setMenuItemData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error("Failed to save menu item:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "preparing":
        return "primary";
      case "ready":
        return "success";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Restaurant Management
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Details" />
        <Tab label="Menu" />
        <Tab label="Orders" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Restaurant Details */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Restaurant Details</Typography>
                  {!isEditing && (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Restaurant Name"
                      value={restaurantData.name}
                      onChange={handleInputChange("name")}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cuisine Type"
                      value={restaurantData.cuisine}
                      onChange={handleInputChange("cuisine")}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={restaurantData.description}
                      onChange={handleInputChange("description")}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={restaurantData.phone}
                      onChange={handleInputChange("phone")}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={restaurantData.email}
                      onChange={handleInputChange("email")}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={restaurantData.address.street}
                      onChange={handleAddressChange("street")}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={restaurantData.address.city}
                      onChange={handleAddressChange("city")}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      value={restaurantData.address.state}
                      onChange={handleAddressChange("state")}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={restaurantData.address.zipCode}
                      onChange={handleAddressChange("zipCode")}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Opening Hours
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(restaurantData.openingHours).map(
                    ([day, hours]) => (
                      <Grid item xs={12} sm={6} key={day}>
                        <Typography variant="subtitle1" gutterBottom>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Open"
                              type="time"
                              value={hours.open}
                              onChange={handleOpeningHoursChange(day, "open")}
                              disabled={!isEditing}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Close"
                              type="time"
                              value={hours.close}
                              onChange={handleOpeningHoursChange(day, "close")}
                              disabled={!isEditing}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  )}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[
                    "Delivery",
                    "Takeout",
                    "Dine-in",
                    "Outdoor Seating",
                    "Parking",
                  ].map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      color={
                        restaurantData.features.includes(feature)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => isEditing && handleFeatureToggle(feature)}
                      sx={{ cursor: isEditing ? "pointer" : "default" }}
                    />
                  ))}
                </Box>

                {isEditing && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSaveRestaurant}
                    sx={{ mt: 3 }}
                  >
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Menu Items</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedMenuItem(null);
                      setMenuItemData({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        image: null,
                      });
                      setMenuDialog(true);
                    }}
                  >
                    Add Menu Item
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {restaurant?.menuItems?.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setSelectedMenuItem(item);
                                setMenuItemData(item);
                                setMenuDialog(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Orders
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order._id}</TableCell>
                          <TableCell>{order.customer.name}</TableCell>
                          <TableCell>
                            {order.items.map((item) => (
                              <Typography key={item._id} variant="body2">
                                {item.quantity}x {item.name}
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                // Handle order details view
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Menu Item Dialog */}
      <Dialog
        open={menuDialog}
        onClose={() => setMenuDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMenuItem ? "Edit Menu Item" : "Add Menu Item"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={menuItemData.name}
                onChange={handleMenuItemChange("name")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={menuItemData.description}
                onChange={handleMenuItemChange("description")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={menuItemData.price}
                onChange={handleMenuItemChange("price")}
                InputProps={{
                  startAdornment: "$",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={menuItemData.category}
                onChange={handleMenuItemChange("category")}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
                fullWidth
              >
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveMenuItem} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RestaurantManagement;
