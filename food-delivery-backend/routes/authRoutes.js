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
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(protect);

router.get("/me", getMe);
router.put("/updatedetails", updateDetails);
router.put("/updatepassword", updatePassword);

router.use(restrictTo("admin"));

router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
