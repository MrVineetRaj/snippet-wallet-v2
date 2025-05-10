import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";

const healthCheck = async (requestAnimationFrame, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (err) {
    res.status(500).json(new ApiError(500, "", err));
  }
};

export { healthCheck };
