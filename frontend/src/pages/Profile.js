import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    preferences: {
      emailNotifications: user?.preferences?.emailNotifications || true,
      smsNotifications: user?.preferences?.smsNotifications || false,
      darkMode: user?.preferences?.darkMode || false,
    },
  });
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleInputChange = (field) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAddressChange = (field) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: event.target.value,
      },
    }));
  };

  const handlePreferenceChange = (preference) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: event.target.checked,
      },
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarDialog(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("address", JSON.stringify(profileData.address));
      formData.append("preferences", JSON.stringify(profileData.preferences));
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleConfirmAvatar = () => {
    setAvatarDialog(false);
    // Handle avatar upload here
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    sx={{ width: 120, height: 120 }}
                  />
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                      component="label"
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <PhotoCameraIcon />
                    </IconButton>
                  )}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {user?.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                {!isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={profileData.name}
                    onChange={handleInputChange("name")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    onChange={handleInputChange("email")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={handleInputChange("phone")}
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
                    value={profileData.address.street}
                    onChange={handleAddressChange("street")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={profileData.address.city}
                    onChange={handleAddressChange("city")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="State"
                    value={profileData.address.state}
                    onChange={handleAddressChange("state")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={profileData.address.zipCode}
                    onChange={handleAddressChange("zipCode")}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.emailNotifications}
                    onChange={handlePreferenceChange("emailNotifications")}
                    disabled={!isEditing}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.smsNotifications}
                    onChange={handlePreferenceChange("smsNotifications")}
                    disabled={!isEditing}
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.darkMode}
                    onChange={handlePreferenceChange("darkMode")}
                    disabled={!isEditing}
                  />
                }
                label="Dark Mode"
              />

              {isEditing && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  sx={{ mt: 2 }}
                >
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialog} onClose={() => setAvatarDialog(false)}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update your profile picture?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmAvatar} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
