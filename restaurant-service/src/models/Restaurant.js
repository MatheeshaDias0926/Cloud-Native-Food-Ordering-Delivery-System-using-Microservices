const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    description: { type: String },
    cuisineType: { type: String },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
RestaurantSchema.virtual("menuItems", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

// Geocoder hook to create location
RestaurantSchema.pre("save", async function (next) {
  if (!this.isModified("address")) return next();

  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
  };
  next();
});

// Indexes
RestaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", RestaurantSchema);
