const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middlewares/async");

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single restaurant with menu
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id).populate(
    "menuItems"
  );

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// @desc    Create new restaurant
// @route   POST /api/v1/restaurants
// @access  Private (Restaurant Owner)
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;

  // Check if user already has a restaurant
  const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });
  if (existingRestaurant) {
    return next(
      new ErrorResponse(`User ${req.user.id} already has a restaurant`, 400)
    );
  }

  // Validate required fields
  const requiredFields = ["name", "address", "cuisine"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return next(
      new ErrorResponse(`Please provide ${missingFields.join(", ")}`, 400)
    );
  }

  try {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.error("Restaurant creation error:", err);
    return next(new ErrorResponse("Error creating restaurant", 500));
  }
});

// @desc    Update restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private (Restaurant Owner)
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  // Verify user is restaurant owner or admin
  if (
    restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this restaurant`,
        403
      )
    );
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// @desc    Delete restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private (Restaurant Owner or Admin)
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  // Verify user is restaurant owner or admin
  if (
    restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this restaurant`,
        403
      )
    );
  }

  // Cascade delete menu items
  await MenuItem.deleteMany({ restaurant: req.params.id });
  await restaurant.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get restaurants within radius
// @route   GET /api/v1/restaurants/radius/:zipcode/:distance
// @access  Public
exports.getRestaurantsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  const radius = distance / 6378;

  const restaurants = await Restaurant.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants,
  });
});

// @desc    Create menu item for restaurant
// @route   POST /api/v1/restaurants/:restaurantId/menu
// @access  Private (Restaurant Owner)
exports.createMenuItem = asyncHandler(async (req, res, next) => {
  req.body.restaurant = req.params.restaurantId;

  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    return next(
      new ErrorResponse(
        `Restaurant not found with id of ${req.params.restaurantId}`,
        404
      )
    );
  }

  // Verify user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add menu items to this restaurant`,
        403
      )
    );
  }

  const menuItem = await MenuItem.create(req.body);

  res.status(201).json({
    success: true,
    data: menuItem,
  });
});

// @desc    Update menu item
// @route   PUT /api/v1/restaurants/:restaurantId/menu/:id
// @access  Private (Restaurant Owner)
exports.updateMenuItem = asyncHandler(async (req, res, next) => {
  let menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    return next(
      new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404)
    );
  }

  const restaurant = await Restaurant.findById(menuItem.restaurant);
  if (restaurant.owner.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this menu item`,
        403
      )
    );
  }

  menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: menuItem,
  });
});

// @desc    Delete menu item
// @route   DELETE /api/v1/restaurants/:restaurantId/menu/:id
// @access  Private (Restaurant Owner)
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    return next(
      new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404)
    );
  }

  const restaurant = await Restaurant.findById(menuItem.restaurant);
  if (restaurant.owner.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this menu item`,
        403
      )
    );
  }

  await menuItem.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get all menu items for a restaurant
// @route   GET /api/v1/restaurants/:restaurantId/menu
// @access  Public
exports.getMenuItems = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next(
      new ErrorResponse(
        `Restaurant not found with id of ${req.params.restaurantId}`,
        404
      )
    );
  }

  const menuItems = await MenuItem.find({
    restaurant: req.params.restaurantId,
  });

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});
