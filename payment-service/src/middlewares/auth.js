const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

module.exports = auth;
