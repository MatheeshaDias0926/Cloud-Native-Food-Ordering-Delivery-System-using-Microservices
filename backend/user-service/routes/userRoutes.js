const express = require("express");
const {
  signUp,
  login,
  getUser,
  getUsers,
  logout,
  deleteUser,
  updateProfile,
  updatePassword,
  getDeliveryPersonnel,
  getRestaurantStaff,
  updateDeliveryPersonnelStatus,
  updateRestaurantStaffStatus,
} = require("../controllers/userController");
const {
  requireAuth,
  requireRoleAdmin,
  requireRoleSeller,
  requireRoleDeliveryPersonnel,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/login", login);

// Protected routes
router.get("/profile", requireAuth, getUser);
router.get("/users", requireAuth, requireRoleAdmin, getUsers);
router.post("/logout", requireAuth, logout);
router.delete("/delete", requireAuth, deleteUser);
router.patch("/update", requireAuth, updateProfile);
router.patch("/update/password", requireAuth, updatePassword);

// Admin routes for managing delivery personnel and restaurant staff
router.get(
  "/delivery-personnel",
  requireAuth,
  requireRoleAdmin,
  getDeliveryPersonnel
);
router.get(
  "/restaurant-staff",
  requireAuth,
  requireRoleAdmin,
  getRestaurantStaff
);
router.patch(
  "/delivery-personnel/status",
  requireAuth,
  requireRoleAdmin,
  updateDeliveryPersonnelStatus
);
router.patch(
  "/restaurant-staff/status",
  requireAuth,
  requireRoleAdmin,
  updateRestaurantStaffStatus
);

module.exports = router;
