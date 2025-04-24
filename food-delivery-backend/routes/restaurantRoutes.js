const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsInRadius,
} = require("../controllers/restaurantController");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getRestaurantsInRadius);

router
  .route("/")
  .get(getRestaurants)
  .post(protect, restrictTo("restaurant"), createRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(protect, restrictTo("restaurant", "admin"), updateRestaurant)
  .delete(protect, restrictTo("restaurant", "admin"), deleteRestaurant);

module.exports = router;
