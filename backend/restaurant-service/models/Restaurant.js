const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  preparationTime: { type: Number, required: true }, // in minutes
  calories: { type: Number },
  ingredients: [String],
  allergens: [String],
  customizationOptions: [
    {
      name: String,
      options: [
        {
          name: String,
          price: Number,
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  isOpen: { type: Boolean, default: true },
  minimumOrderAmount: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  deliveryRadius: { type: Number, required: true }, // in kilometers
  menu: [menuItemSchema],
  images: [String],
  phone: { type: String, required: true },
  email: { type: String, required: true },
  taxRate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a 2dsphere index for location-based queries
restaurantSchema.index({ location: "2dsphere" });

// Update the updatedAt timestamp before saving
restaurantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
