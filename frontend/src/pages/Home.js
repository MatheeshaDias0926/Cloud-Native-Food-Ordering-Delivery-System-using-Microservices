import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../store/slices/restaurantSlice";

const categories = [
  { id: 1, name: "Pizza", image: "/images/categories/pizza.jpg" },
  { id: 2, name: "Burgers", image: "/images/categories/burgers.jpg" },
  { id: 3, name: "Sushi", image: "/images/categories/sushi.jpg" },
  { id: 4, name: "Desserts", image: "/images/categories/desserts.jpg" },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "60vh",
          backgroundImage: "url('/images/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 6,
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            p: 4,
            borderRadius: 2,
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Delicious Food Delivered To Your Door
          </Typography>
          <Typography variant="h5" gutterBottom>
            Order from your favorite restaurants with just a few clicks
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/restaurants")}
            sx={{ mt: 2 }}
          >
            Order Now
          </Button>
        </Box>
      </Box>

      {/* Categories Section */}
      <Typography variant="h4" component="h2" gutterBottom>
        Food Categories
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s",
                },
              }}
              onClick={() => navigate(`/restaurants?category=${category.name}`)}
            >
              <CardMedia
                component="img"
                height="140"
                image={category.image}
                alt={category.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Featured Restaurants Section */}
      <Typography variant="h4" component="h2" gutterBottom>
        Featured Restaurants
      </Typography>
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography>Loading...</Typography>
          </Grid>
        ) : (
          restaurants.slice(0, 4).map((restaurant) => (
            <Grid item xs={12} sm={6} md={3} key={restaurant._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  },
                }}
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
              >
                <CardMedia
                  component="img"
                  height="140"
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

export default Home;
