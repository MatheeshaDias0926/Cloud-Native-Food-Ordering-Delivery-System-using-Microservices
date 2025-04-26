const express = require("express");
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.use(protect);

router.get("/me", getMe);
router.put("/updatedetails", updateDetails);
router.put("/updatepassword", updatePassword);

// Admin routes
router.use(authorize("admin"));

router.route("/users").get(getUsers);

router.route("/users/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
