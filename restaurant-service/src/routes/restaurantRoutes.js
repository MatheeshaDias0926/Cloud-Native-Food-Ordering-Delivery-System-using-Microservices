const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsInRadius,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
} = require("../controllers/restaurantController");
const { protect, authorize } = require("../middlewares/auth");
const advancedResults = require("../middlewares/advancedResults");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

const router = express.Router({ mergeParams: true });

// Public routes
router.get("/", advancedResults(Restaurant, "menuItems"), getRestaurants);
router.get("/radius/:zipcode/:distance", getRestaurantsInRadius);
router.get("/:id", getRestaurant);

// Protected routes
router.use(protect);

// Restaurant routes
router.post("/", authorize("restaurant"), createRestaurant);
router.put("/:id", authorize("restaurant", "admin"), updateRestaurant);
router.delete("/:id", authorize("restaurant", "admin"), deleteRestaurant);

// Menu item routes
router.get("/:restaurantId/menu", getMenuItems); // Public access to menu items
router.post("/:restaurantId/menu", authorize("restaurant"), createMenuItem);
router.put("/:restaurantId/menu/:id", authorize("restaurant"), updateMenuItem);
router.delete(
  "/:restaurantId/menu/:id",
  authorize("restaurant"),
  deleteMenuItem
);

module.exports = router;
