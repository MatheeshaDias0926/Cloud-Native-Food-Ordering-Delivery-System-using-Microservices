const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/sendEmail");
const ErrorResponse = require("../utils/errorResponse");

// Register User
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      restaurantName,
      cuisineType,
      imageUrl,
    } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
    });

    // If restaurant owner, create restaurant
    if (role === "restaurant") {
      // Validate imageUrl if provided
      if (imageUrl) {
        try {
          new URL(imageUrl);
        } catch (err) {
          return next(
            new ErrorResponse("Please provide a valid image URL", 400)
          );
        }
      }

      const restaurant = await Restaurant.create({
        name: restaurantName,
        cuisineType,
        address,
        imageUrl,
        owner: user._id,
      });
      user.restaurant = restaurant._id;
      await user.save();
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Try to send welcome email, but don't block registration if it fails
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to FoodDelivery",
        message: `Hi ${user.name},\n\nWelcome to our platform!`,
      });
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get current logged in user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Update user details
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get single user
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
