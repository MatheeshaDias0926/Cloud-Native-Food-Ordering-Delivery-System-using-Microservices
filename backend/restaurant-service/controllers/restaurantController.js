const Restaurant = require("../models/Restaurant");
const axios = require("axios");

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      ownerId: req.userId,
    });
    await restaurant.save();
    res
      .status(201)
      .json({ message: "Restaurant created successfully", restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

// Get all restaurants with optional filters
const getRestaurants = async (req, res) => {
  try {
    const {
      cuisine,
      minRating,
      isOpen,
      location,
      radius, // in kilometers
    } = req.query;

    let query = {};

    // Apply filters
    if (cuisine) query.cuisine = cuisine;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (isOpen) query.isOpen = isOpen === "true";

    // Location-based search
    if (location && radius) {
      const [longitude, latitude] = location.split(",").map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    const restaurants = await Restaurant.find(query)
      .select("-menu")
      .populate("ownerId", "name email");

    res.status(200).json({ restaurants });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching restaurants" });
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

// Update restaurant details
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res
      .status(200)
      .json({ message: "Restaurant updated successfully", restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

// Add menu item
const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menu.push(req.body);
    await restaurant.save();

    res
      .status(201)
      .json({ message: "Menu item added successfully", restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding menu item" });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItem = restaurant.menu.id(req.params.menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    Object.assign(menuItem, req.body);
    await restaurant.save();

    res
      .status(200)
      .json({ message: "Menu item updated successfully", restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating menu item" });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menu.pull(req.params.menuItemId);
    await restaurant.save();

    res
      .status(200)
      .json({ message: "Menu item deleted successfully", restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting menu item" });
  }
};

// Update restaurant rating
const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Calculate new average rating
    const newTotal = restaurant.rating * restaurant.totalReviews + rating;
    restaurant.totalReviews += 1;
    restaurant.rating = newTotal / restaurant.totalReviews;

    await restaurant.save();

    res
      .status(200)
      .json({ message: "Rating updated successfully", restaurant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating rating" });
  }
};

// Get restaurant orders
const getRestaurantOrders = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/api/orders/restaurant/${req.params.id}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching restaurant orders" });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateRating,
  getRestaurantOrders,
};
