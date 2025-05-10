import { body } from "express-validator";
import { AvailablePlatformUserRoles } from "../utils/constants.js";

const createCodeSnippetValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("path").trim().notEmpty().withMessage("Path is required"),
    body("programmingLanguage")
      .trim()
      .notEmpty()
      .withMessage("Programming language is required"),
    body("code")
      .trim()
      .notEmpty()
      .withMessage("Code is required")
  ];
};

export { createCodeSnippetValidator };
