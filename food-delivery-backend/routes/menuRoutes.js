const express = require("express");
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getMenuItems)
  .post(protect, restrictTo("restaurant"), createMenuItem);

router
  .route("/:id")
  .get(getMenuItem)
  .put(protect, restrictTo("restaurant"), updateMenuItem)
  .delete(protect, restrictTo("restaurant"), deleteMenuItem);

module.exports = router;
