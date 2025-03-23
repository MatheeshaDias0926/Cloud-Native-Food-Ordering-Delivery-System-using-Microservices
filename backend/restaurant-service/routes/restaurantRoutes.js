const express = require("express");
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateRating,
  getRestaurantOrders,
} = require("../controllers/restaurantController");
const {
  requireAuth,
  requireRoleSeller,
  requireRoleAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

// Restaurant owner routes
router.post("/", requireAuth, requireRoleSeller, createRestaurant);
router.patch("/:id", requireAuth, requireRoleSeller, updateRestaurant);
router.post("/:id/menu", requireAuth, requireRoleSeller, addMenuItem);
router.patch(
  "/:id/menu/:menuItemId",
  requireAuth,
  requireRoleSeller,
  updateMenuItem
);
router.delete(
  "/:id/menu/:menuItemId",
  requireAuth,
  requireRoleSeller,
  deleteMenuItem
);
router.get("/:id/orders", requireAuth, requireRoleSeller, getRestaurantOrders);

// User routes
router.post("/:id/rating", requireAuth, updateRating);

// Admin routes
router.delete("/:id", requireAuth, requireRoleAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting restaurant" });
  }
});

module.exports = router;
