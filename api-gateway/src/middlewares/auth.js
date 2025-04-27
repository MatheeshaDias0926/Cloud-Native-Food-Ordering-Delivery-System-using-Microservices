const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Skip authentication for auth routes
  if (req.path.startsWith("/api/v1/auth")) {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user data from token
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    // Log user data for debugging
    console.log("Authenticated user:", req.user);

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
      details: err.message,
    });
  }
};
