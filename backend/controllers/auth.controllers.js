import crypto from "crypto";
import { User } from "../database/models/user.model.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import {
  emailVerificationMailContent,
  forgotPasswordMailContent,
  sendMail,
} from "../utils/mail.js";
import { ApiError } from "../utils/api.error.js";
import {
  AvailablePlatformUserRoles,
  CookieOptions,
  PlatformUserRoles,
} from "../utils/constants.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, fullname } = req.body;

  console.log(req.body, AvailablePlatformUserRoles);
  // const password =
  const user = new User({
    email,
    password,
    role: role || PlatformUserRoles.USER,
    fullname,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    email,
    subject: "Email Verification Mail",
    mailGenContent: emailVerificationMailContent(
      fullname,
      `http://localhost:8080/api/v1/user/verify-email/${unHashedToken}`
    ),
  });

  res.status(201).json(new ApiResponse(201, user, "Verification Mail Sent"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Not Verified", [
      {
        auth: "Invalid credentials",
      },
    ]);
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new ApiError(401, "Not Verified", [
      {
        auth: "Invalid credentials",
      },
    ]);
  }

  const accessToken = await user.generateAccessToken();

  res.cookie(process.env.JWT_NAME, accessToken, CookieOptions);
  res.status(200).json(new ApiResponse(200, user, "Logged in successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(401, "Not Verified", [
      {
        token: "Token Expired",
      },
    ]);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined; //info : assigning undefined to these attribute as it will remove these fields from database
  user.emailVerificationExpiry = undefined;

  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "Account Verified"
    )
  );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Token sending failed", [
      {
        err: "User not found",
      },
    ]);
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    email,
    subject: "Email Verification Mail",
    mailGenContent: emailVerificationMailContent(
      user.fullname,
      `http://localhost:8080/api/v1/user/verify-email/${unHashedToken}`
    ),
  });

  res.status(201).json(new ApiResponse(201, user, "User created Successfully"));
  res.status(200).json(new ApiResponse(200, user, "Verification mail sent"));
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid Email");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save();

  const mailInfo = await sendMail({
    email,
    subject: "Reset password mail",
    mailGenContent: forgotPasswordMailContent(
      user.username,
      `http://localhost:8080/api/v1/user/forget-password/${unHashedToken}`
    ),
  });

  console.log(mailInfo);
  res.status(200).json(new ApiResponse(200, {}, "Forgot password link send"));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { forgotPasswordToken } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(forgotPasswordToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: {
      $gt: Date.now(),
    },
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "Access Token Expired");
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Password updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User loaded"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie(process.env.JWT_SECRET, "", CookieOptions);
  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

//todo : Logout from all devices

const updateUserName = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(404).json(new ApiResponse(404, {}, "Username already in use"));
    return;
  }

  req.user.username = username;

  await req.user.save();

  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPasswordRequest,
  getCurrentUser,
  updatePassword,
  updateUserName,
};
