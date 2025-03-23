import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantById } from "../store/slices/restaurantSlice";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurant, loading } = useSelector((state) => state.restaurant);
  const { items } = useSelector((state) => state.cart);

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddToCart = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpecialInstructions("");
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleConfirmAdd = () => {
    dispatch(
      addToCart({
        ...selectedItem,
        quantity,
        specialInstructions,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
      })
    );
    setSelectedItem(null);
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const getCartItemQuantity = (itemId) => {
    const item = items.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container>
        <Typography>Restaurant not found</Typography>
      </Container>
    );
  }

  const categories = [...new Set(restaurant.menu.map((item) => item.category))];

  return (
    <Container maxWidth="lg">
      {/* Restaurant Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="300"
              image={restaurant.image}
              alt={restaurant.name}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {restaurant.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={restaurant.rating} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({restaurant.reviewCount} reviews)
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {restaurant.cuisine}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {restaurant.features.map((feature) => (
                <Chip key={feature} label={feature} />
              ))}
            </Box>
            <Typography variant="body1" paragraph>
              {restaurant.description}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Menu Categories */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {categories.map((category, index) => (
          <Tab key={category} label={category} value={index} />
        ))}
      </Tabs>

      {/* Menu Items */}
      <Grid container spacing={3}>
        {restaurant.menu
          .filter((item) => item.category === categories[selectedTab])
          .map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getCartItemQuantity(item._id) > 0 ? (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{getCartItemQuantity(item._id)}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleAddToCart(item)}
                        >
                          <AddIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Add to Cart Dialog */}
      <Dialog
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add to Cart</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedItem?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            ${selectedItem?.price.toFixed(2)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <IconButton onClick={() => handleQuantityChange(-1)}>
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ mx: 2 }}>{quantity}</Typography>
            <IconButton onClick={() => handleQuantityChange(1)}>
              <AddIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmAdd}
            startIcon={<CartIcon />}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RestaurantDetails;
