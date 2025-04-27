const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: { type: String },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price must be at least 0"],
  },
  category: { type: String },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  isAvailable: { type: Boolean, default: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
