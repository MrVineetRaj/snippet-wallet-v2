import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { User } from "../database/models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  // Get token from cookies
  const accessToken = req.cookies?.[process.env.JWT_NAME];

  console.log("Access Token: ", accessToken);
  if (!accessToken) {
    throw new ApiError(401, "Unauthorized Access");
  }

  const decoded = jwt.decode(accessToken, process.env.JWT_SECRET);

  console.log("Decoded Token: ", decoded.id);

  const user = await User.findById(decoded.id);


  req.user = user;

  next();
});
