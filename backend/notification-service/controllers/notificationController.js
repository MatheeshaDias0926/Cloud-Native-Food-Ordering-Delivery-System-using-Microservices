const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { type, title, message, orderId, deliveryId, userId } = req.body;

    const notification = new Notification({
      type,
      title,
      message,
      orderId,
      deliveryId,
      userId,
    });

    await notification.save();

    // Send email notification
    await sendEmail(notification);

    // Send SMS notification
    await sendSMS(notification);

    res
      .status(201)
      .json({ message: "Notification created successfully", notification });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating notification" });
  }
};

// Send email notification
const sendEmail = async (notification) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: notification.userId.email, // Assuming user email is populated
      subject: notification.title,
      html: `
        <h2>${notification.title}</h2>
        <p>${notification.message}</p>
        ${
          notification.orderId ? `<p>Order ID: ${notification.orderId}</p>` : ""
        }
        <p>Time: ${new Date(notification.createdAt).toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    notification.emailSent = true;
    await notification.save();
  } catch (err) {
    console.log("Error sending email:", err);
  }
};

// Send SMS notification
const sendSMS = async (notification) => {
  try {
    await twilioClient.messages.create({
      body: `${notification.title}\n${notification.message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: notification.userId.mobile, // Assuming user mobile is populated
    });
    notification.smsSent = true;
    await notification.save();
  } catch (err) {
    console.log("Error sending SMS:", err);
  }
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate("orderId")
      .populate("deliveryId");
    res.status(200).json({ notifications });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating notification" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
