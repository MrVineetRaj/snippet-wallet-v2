import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createFolderValidator,
} from "../validators/folder.validator.js";

import {
  createFolder,
  getFolderByPath,
  getFolder,
  updateFolder,
  deleteFolder,
  getRecentlyOpenedFolders,
} from "../controllers/folder.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

//note : Allowed authorized access
router.post(
  "/create",
  authMiddleware,
  createFolderValidator(),
  validate,
  createFolder
);

router.get("/get-by-path", authMiddleware, getFolderByPath);
router.get("/get/:id", authMiddleware, getFolder);
router.put(
  "/update/:id",
  authMiddleware,
  updateFolder
);
router.delete("/delete/:id", authMiddleware, deleteFolder);
router.get("/recent", authMiddleware, getRecentlyOpenedFolders);

export default router;
