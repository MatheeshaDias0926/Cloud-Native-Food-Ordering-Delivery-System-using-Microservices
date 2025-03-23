import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const steps = ["Delivery Address", "Payment Method", "Review Order"];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddressChange = (field) => (event) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCardChange = (field) => (event) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateDeliveryFee = () => {
    return calculateSubtotal() > 50 ? 0 : 5;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items,
        deliveryAddress,
        paymentMethod,
        cardDetails: paymentMethod === "card" ? cardDetails : null,
        total: calculateTotal(),
        userId: user._id,
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const renderDeliveryAddress = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            value={deliveryAddress.street}
            onChange={handleAddressChange("street")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={deliveryAddress.city}
            onChange={handleAddressChange("city")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="State"
            value={deliveryAddress.state}
            onChange={handleAddressChange("state")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="ZIP Code"
            value={deliveryAddress.zipCode}
            onChange={handleAddressChange("zipCode")}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Country"
            value={deliveryAddress.country}
            onChange={handleAddressChange("country")}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPaymentMethod = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Credit/Debit Card"
          />
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label="Cash on Delivery"
          />
        </RadioGroup>
      </FormControl>

      {paymentMethod === "card" && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={cardDetails.number}
                onChange={handleCardChange("number")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={cardDetails.expiry}
                onChange={handleCardChange("expiry")}
                placeholder="MM/YY"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="CVV"
                value={cardDetails.cvv}
                onChange={handleCardChange("cvv")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={cardDetails.name}
                onChange={handleCardChange("name")}
                required
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );

  const renderOrderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Review
      </Typography>
      {items.map((item) => (
        <Box key={item._id} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            {item.name} x {item.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.restaurantName}
          </Typography>
          <Typography variant="body2">
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          {item.specialInstructions && (
            <Typography variant="body2" color="text.secondary">
              Special Instructions: {item.specialInstructions}
            </Typography>
          )}
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography>Subtotal</Typography>
          <Typography>${calculateSubtotal().toFixed(2)}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography>Tax (10%)</Typography>
          <Typography>${calculateTax().toFixed(2)}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography>Delivery Fee</Typography>
          <Typography>
            {calculateDeliveryFee() === 0
              ? "Free"
              : `$${calculateDeliveryFee().toFixed(2)}`}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {activeStep === 0 && renderDeliveryAddress()}
              {activeStep === 1 && renderPaymentMethod()}
              {activeStep === 2 && renderOrderReview()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal</Typography>
                  <Typography>${calculateSubtotal().toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Tax (10%)</Typography>
                  <Typography>${calculateTax().toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Delivery Fee</Typography>
                  <Typography>
                    {calculateDeliveryFee() === 0
                      ? "Free"
                      : `$${calculateDeliveryFee().toFixed(2)}`}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {activeStep > 0 && (
                    <Button fullWidth variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <Button fullWidth variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
