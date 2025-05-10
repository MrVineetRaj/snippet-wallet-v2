import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { User } from "../database/models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  // Get token from cookies
  const accessToken = req.cookies?.[process.env.JWT_NAME];

  if (!accessToken) {
    throw new ApiError(404, "Unauthorized Access");
  }

  const decoded = jwt.decode(accessToken, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, "Unauthorized Access");
  }

  req.user = user;

  next();
});
