const express = require("express");
const {
  signUp,
  login,
  getUser,
  getUsers,
  logout,
  deleteUser,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const {
  requireAuth,
  requireRoleAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile", requireAuth, getUser);
router.get("/users", requireAuth, requireRoleAdmin, getUsers);
router.post("/logout", requireAuth, logout);
router.delete("/delete", requireAuth, deleteUser);
router.patch("/update", requireAuth, updateProfile);
router.patch("/update/password", requireAuth, updatePassword);

module.exports = router;
