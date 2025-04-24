const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  cuisineType: { type: String },
  address: { type: String, required: true },
  imageUrl: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true; // Allow empty values
        try {
          new URL(v);
          return true;
        } catch (err) {
          return false;
        }
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
  openingHours: {
    monday: { open: String, close: String },
    // ... other days
  },
  menuItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

RestaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", RestaurantSchema);
