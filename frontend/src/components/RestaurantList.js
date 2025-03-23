import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import useAsync from "../hooks/useAsync";
import { restaurantAPI } from "../services/api";

const RestaurantList = () => {
  const {
    data: restaurants,
    loading,
    error,
    execute: fetchRestaurants,
  } = useAsync(restaurantAPI.getAll);
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    fetchRestaurants({ search: searchQuery });
  }, [searchQuery, fetchRestaurants]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search restaurants..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {restaurants?.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={restaurant.image || "/placeholder.jpg"}
                alt={restaurant.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.cuisine}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {restaurant.rating} ({restaurant.reviewCount} reviews)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delivery Time: {restaurant.deliveryTime} mins
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Min. Order: ${restaurant.minOrder}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {restaurants?.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RestaurantList;
