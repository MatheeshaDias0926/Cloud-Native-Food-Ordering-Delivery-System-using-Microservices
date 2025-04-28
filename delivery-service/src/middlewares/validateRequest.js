import { validationResult } from "express-validator";
import { ErrorResponse } from "../utils/errorResponse.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new ErrorResponse(errorMessages.join(", "), 400));
  }
  next();
};
