const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["customer", "restaurant", "delivery", "admin"],
    default: "customer",
  },
  isVerified: { type: Boolean, default: false },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }, // for restaurant owners
  vehicleNumber: { type: String }, // for delivery personnel
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ location: "2dsphere" });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
