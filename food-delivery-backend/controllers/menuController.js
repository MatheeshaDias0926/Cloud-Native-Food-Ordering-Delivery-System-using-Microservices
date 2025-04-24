const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all menu items for a restaurant
// @route   GET /api/v1/restaurants/:restaurantId/menu
// @access  Public
exports.getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({
      restaurant: req.params.restaurantId,
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single menu item
// @route   GET /api/v1/menu/:id
// @access  Public
exports.getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return next(
        new ErrorResponse(
          `Menu item not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create menu item
// @route   POST /api/v1/restaurants/:restaurantId/menu
// @access  Private (Restaurant Owner)
exports.createMenuItem = async (req, res, next) => {
  try {
    // Add restaurant to req.body
    req.body.restaurant = req.params.restaurantId;

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.restaurantId}`,
          404
        )
      );
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add menu items to this restaurant`,
          401
        )
      );
    }

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update menu item
// @route   PUT /api/v1/menu/:id
// @access  Private (Restaurant Owner)
exports.updateMenuItem = async (req, res, next) => {
  try {
    console.log("Updating menu item with ID:", req.params.id);
    let menuItem = await MenuItem.findById(req.params.id);
    console.log("Menu item found:", menuItem);
    if (!menuItem) {
      return next(
        new ErrorResponse(
          `Menu item not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Get restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurant);

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this menu item`,
          401
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
  } catch (err) {
    console.error("Error in updateMenuItem:", err);
    next(err);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/v1/menu/:id
// @access  Private (Restaurant Owner)
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return next(
        new ErrorResponse(
          `Menu item not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Get restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurant);

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this menu item`,
          401
        )
      );
    }

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
