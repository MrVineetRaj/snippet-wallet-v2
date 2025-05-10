import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { createCodeSnippetValidator } from "../validators/codesnippet.validator.js";

import {
  createCodeSnippet,
  getCodeSnippetByPath,
  getCodeSnippet,
  updateCodeSnippet,
  deleteCodeSnippet,
} from "../controllers/codesnippet.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

//note : Allowed authorized access
router.post(
  "/create",
  authMiddleware,
  createCodeSnippetValidator(),
  validate,
  createCodeSnippet
);

router.get("/get-by-path", authMiddleware, getCodeSnippetByPath);
router.get("/get/:id", authMiddleware, getCodeSnippet);
router.put("/update/:id", authMiddleware, validate, updateCodeSnippet);
router.delete("/delete/:id", authMiddleware, deleteCodeSnippet);

export default router;
