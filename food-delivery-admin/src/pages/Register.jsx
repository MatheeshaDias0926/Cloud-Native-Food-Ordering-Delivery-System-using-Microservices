import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { registerUser } from "../store/slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer",
    vehicleNumber: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });
  const [error, setError] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error: authError,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData((prev) => ({
      ...prev,
      role,
      vehicleNumber: role === "delivery" ? prev.vehicleNumber : "",
      restaurant: role === "restaurant" ? prev.restaurant : null,
    }));
  };

  const handleLocationChange = () => {
    if (latitude && longitude) {
      setFormData((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        navigate("/login"); // Redirect after success
      })
      .catch((err) => {
        setError(err.message || "Registration failed. Please try again.");
      });
  };
  

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={formData.role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="restaurant">Restaurant Owner</MenuItem>
              <MenuItem value="delivery">Delivery Personnel</MenuItem>
            </Select>
          </FormControl>

          {formData.role === "delivery" && (
            <TextField
              label="Vehicle Number"
              name="vehicleNumber"
              fullWidth
              margin="normal"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required={formData.role === "delivery"}
            />
          )}

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Location (optional)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              label="Latitude"
              fullWidth
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              onBlur={handleLocationChange}
            />
            <TextField
              label="Longitude"
              fullWidth
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              onBlur={handleLocationChange}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;