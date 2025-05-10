import { body } from "express-validator";
import { AvailablePlatformUserRoles } from "../utils/constants.js";

const registrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .optional()
      .isIn(AvailablePlatformUserRoles)
      .withMessage("Role must be either 'user' or 'admin'"),
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Full Name is required")
      .isLength({ min: 3 })
      .withMessage("At least 3 Character Long"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ];
};

const justEmailValidator = () => {
  return [body("email").isEmail().withMessage("Email is not valid")];
};
const updatePasswordValidator = () => {
  return [
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const updateUserNameValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3 to 13 characters long"),
  ];
};

export {
  registrationValidator,
  userLoginValidator,
  justEmailValidator,
  updatePasswordValidator,
  updateUserNameValidator,
};
