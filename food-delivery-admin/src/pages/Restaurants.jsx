import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestaurantMenu as MenuIcon,
} from "@mui/icons-material";
import {
  fetchRestaurants,
  updateRestaurantDetails,
  removeRestaurant,
} from "../store/slices/restaurantsSlice";
import { useNavigate } from "react-router-dom";

const Restaurants = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector(
    (state) => state.restaurants
  );
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    cuisine: "",
    isActive: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditData({
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      cuisine: restaurant.cuisine,
      isActive: restaurant.isActive,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      await dispatch(removeRestaurant(restaurantId));
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRestaurant(null);
    setEditData({
      name: "",
      description: "",
      address: "",
      phone: "",
      cuisine: "",
      isActive: true,
    });
  };

  const handleSubmit = async () => {
    if (selectedRestaurant) {
      await dispatch(
        updateRestaurantDetails({
          id: selectedRestaurant._id,
          data: editData,
        })
      );
      handleClose();
    }
  };

  const handleManageMenu = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

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
        Restaurants Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant._id}>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>{restaurant.cuisine}</TableCell>
                <TableCell>{restaurant.address}</TableCell>
                <TableCell>{restaurant.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={restaurant.isActive ? "Active" : "Inactive"}
                    color={restaurant.isActive ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(restaurant)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleManageMenu(restaurant._id)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(restaurant._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Restaurant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={editData.address}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={editData.phone}
            onChange={(e) =>
              setEditData({ ...editData, phone: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Cuisine"
            fullWidth
            value={editData.cuisine}
            onChange={(e) =>
              setEditData({ ...editData, cuisine: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Restaurants;
