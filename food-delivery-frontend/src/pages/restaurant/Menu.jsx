import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMenuItems, createMenuItem } from "../../services/restaurants";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RestaurantMenu = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "restaurant") {
        navigate("/login");
        return;
      }
      fetchMenuItems();
    }
  }, [user, authLoading]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.restaurantId) {
        throw new Error("Restaurant ID not found");
      }
      const response = await getMenuItems(user.restaurantId);
      setMenuItems(response.data || []);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load menu items. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      isAvailable: true,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (!user?.restaurantId) {
        throw new Error("Restaurant ID not found");
      }
      const menuItemData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await createMenuItem(user.restaurantId, menuItemData);
      await fetchMenuItems(); // Refresh the menu items list
      handleCloseDialog();
    } catch (err) {
      console.error("Error creating menu item:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save menu item. Please try again."
      );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!user || user.role !== "restaurant") {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Menu Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <button
            onClick={handleOpenDialog}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Item
          </button>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {menuItems.length === 0 ? (
          <p className="text-gray-600">No menu items added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item._id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-lg font-bold mt-2">${item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="mt-4">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  name="category"
                  fullWidth
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Image URL"
                  name="image"
                  fullWidth
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RestaurantMenu;
