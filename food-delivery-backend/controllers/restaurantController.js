const Restaurant = require("../models/Restaurant");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../config/geocoder"); // Add this line

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
exports.getRestaurants = async (req, res, next) => {
  try {
    // Filter by location if provided
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = Restaurant.find(JSON.parse(queryStr));

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Restaurant.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const restaurants = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: restaurants.length,
      pagination,
      data: restaurants,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single restaurant
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "menuItems"
    );

    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create restaurant
// @route   POST /api/v1/restaurants
// @access  Private (Restaurant Owner)
exports.createRestaurant = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;

    // Check for existing restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });

    if (existingRestaurant) {
      return next(
        new ErrorResponse(`User ${req.user.id} already has a restaurant`, 400)
      );
    }

    // Validate imageUrl if provided
    if (req.body.imageUrl) {
      try {
        new URL(req.body.imageUrl);
      } catch (err) {
        return next(new ErrorResponse("Please provide a valid image URL", 400));
      }
    }

    const restaurant = await Restaurant.create(req.body);

    // Update user with restaurant reference
    await User.findByIdAndUpdate(req.user.id, { restaurant: restaurant._id });

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private (Restaurant Owner)
exports.updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is restaurant owner
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this restaurant`,
          401
        )
      );
    }

    // Validate imageUrl if provided
    if (req.body.imageUrl) {
      try {
        new URL(req.body.imageUrl);
      } catch (err) {
        return next(new ErrorResponse("Please provide a valid image URL", 400));
      }
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private (Restaurant Owner or Admin)
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is restaurant owner or admin
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this restaurant`,
          401
        )
      );
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get restaurants within radius
// @route   GET /api/v1/restaurants/radius/:zipcode/:distance
// @access  Private
exports.getRestaurantsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth (3,963 mi / 6,378 km)
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
  } catch (err) {
    next(err);
  }
};
