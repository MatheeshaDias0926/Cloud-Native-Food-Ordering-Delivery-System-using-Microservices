import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../store/slices/restaurantSlice";

const cuisines = [
  "Italian",
  "Japanese",
  "Chinese",
  "Indian",
  "Mexican",
  "American",
  "Thai",
  "Mediterranean",
];

const features = [
  "Delivery",
  "Takeout",
  "Dine-in",
  "Outdoor Seating",
  "Wheelchair Accessible",
  "Parking Available",
];

const Restaurants = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurant);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCuisine, setSelectedCuisine] = useState(
    searchParams.get("cuisine") || ""
  );
  const [selectedFeatures, setSelectedFeatures] = useState(
    searchParams.get("features")?.split(",") || []
  );
  const [priceRange, setPriceRange] = useState([0, 5]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCuisine) params.set("cuisine", selectedCuisine);
    if (selectedFeatures.length)
      params.set("features", selectedFeatures.join(","));
    if (priceRange[0] > 0 || priceRange[1] < 5)
      params.set("price", priceRange.join(","));
    if (rating > 0) params.set("rating", rating);

    setSearchParams(params);
    dispatch(fetchRestaurants(params.toString()));
  }, [
    dispatch,
    searchQuery,
    selectedCuisine,
    selectedFeatures,
    priceRange,
    rating,
  ]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCuisineChange = (event) => {
    setSelectedCuisine(event.target.value);
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCuisine =
      !selectedCuisine || restaurant.cuisine === selectedCuisine;
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((feature) =>
        restaurant.features.includes(feature)
      );
    const matchesPrice =
      restaurant.priceLevel >= priceRange[0] &&
      restaurant.priceLevel <= priceRange[1];
    const matchesRating = restaurant.rating >= rating;

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesFeatures &&
      matchesPrice &&
      matchesRating
    );
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Restaurants
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={selectedCuisine}
                label="Cuisine"
                onChange={handleCuisineChange}
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Features */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Features
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {features.map((feature) => (
              <Chip
                key={feature}
                label={feature}
                onClick={() => handleFeatureToggle(feature)}
                color={
                  selectedFeatures.includes(feature) ? "primary" : "default"
                }
                variant={
                  selectedFeatures.includes(feature) ? "filled" : "outlined"
                }
              />
            ))}
          </Box>
        </Box>

        {/* Price Range and Rating */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              marks
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">$</Typography>
              <Typography variant="body2">$$$$$</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Rating
              value={rating}
              onChange={handleRatingChange}
              precision={0.5}
              size="large"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Restaurant List */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography>Loading...</Typography>
          </Grid>
        ) : filteredRestaurants.length === 0 ? (
          <Grid item xs={12}>
            <Typography>
              No restaurants found matching your criteria.
            </Typography>
          </Grid>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s",
                  },
                }}
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.image}
                  alt={restaurant.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {restaurant.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Rating value={restaurant.rating} readOnly size="small" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({restaurant.reviewCount})
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {restaurant.cuisine}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {restaurant.features.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Restaurants;
