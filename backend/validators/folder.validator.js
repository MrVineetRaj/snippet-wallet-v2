import { body } from "express-validator";

const createFolderValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("path").trim().notEmpty().withMessage("Path is required"),
  ];
};
const updateFolderValidator = () => {
  return [body("name").trim().notEmpty().withMessage("Name is required")];
};

export { createFolderValidator };
