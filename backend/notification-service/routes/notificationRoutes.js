const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Create notification (internal service route)
router.post("/", createNotification);

// User routes
router.get("/my-notifications", requireAuth, getUserNotifications);
router.patch("/:id/read", requireAuth, markNotificationAsRead);
router.delete("/:id", requireAuth, deleteNotification);

module.exports = router;
