import { Folder } from "../database/models/folder.model.js";
import { asyncHandler } from "../utils/async.handler.js";
import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import { CodeSnippet } from "../database/models/codesnippet.model.js";
import mongoose, { Schema } from "mongoose";

export const createFolder = asyncHandler(async (req, res) => {
  const { name, description, path } = req.body;

  if (!name || !path) {
    throw new ApiError(400, "Name and path are required", [
      {
        folder: "Name and path are required",
      },
    ]);
  }

  if (!path.startsWith("~") || !path.endsWith("/")) {
    throw new ApiError(400, "Invalid Path", [
      {
        folder: "Path should start with ~ and end with /",
      },
    ]);
  }
  const pathSegments = path.split("/");
  const parentFolder = pathSegments[pathSegments.length - 2];

  console.log("parentFolder", parentFolder);

  const isValidParent =
    parentFolder === "~" ? true : mongoose.Types.ObjectId.isValid(parentFolder);

  if (!isValidParent) {
    throw new ApiError(400, "Invalid Parent Folder", [
      {
        folder: "Parent folder should be a valid ObjectId",
      },
    ]);
  }

  if (parentFolder !== "~") {
    const doesPathExist = await Folder.findById(parentFolder);

    if (!doesPathExist) {
      throw new ApiError(400, "Parent folder does not exist", [
        {
          folder: "Parent folder does not exist",
        },
      ]);
    }
  }

  if (path.split("/").length >= 7) {
    throw new ApiError(400, "Path is too long", [
      {
        folder: "Maximum 5 levels of folders are allowed",
      },
    ]);
  }

  const folderExists = await Folder.findOne({
    name,
    path,
  });

  if (folderExists) {
    throw new ApiError(400, "Folder already exists", [
      {
        folder: "Folder already exists",
      },
    ]);
  }

  const folder = new Folder({
    name,
    description: description || undefined,
    path,
    depth: path.split("/").length,
    createdBy: req.user._id,
  });

  await folder.save();

  res.status(201).json(new ApiResponse(201, folder, "Folder Created"));
});

export const getFolderByPath = asyncHandler(async (req, res) => {
  const { path } = req.query;

  const folders = await Folder.find({
    path: `${path || "~/"}`,
  });
  res.status(200).json(new ApiResponse(200, folders, "Folders Fetched"));
});

export const getFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || (id && mongoose.Types.ObjectId.isValid(id) === false)) {
    throw new ApiError(400, "Folder ID is required", [
      {
        folder: "Folder ID is required",
      },
    ]);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Folder ID", [
      {
        folder: "Folder ID should be a valid ObjectId",
      },
    ]);
  }

  const folder = await Folder.findByIdAndUpdate(
    id,
    {
      lastOpened: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!folder) {
    throw new ApiError(404, "Folder not found", [
      {
        folder: "Folder not found",
      },
    ]);
  }
  res.status(200).json(new ApiResponse(200, folder, "Folder Fetched"));
});

export const updateFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const folder = await Folder.findByIdAndUpdate(
    id,
    {
      name,
      description,
      lastOpened: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!folder) {
    throw new ApiError(404, "Folder not found", [
      {
        folder: "Folder not found",
      },
    ]);
  }

  res.status(200).json(new ApiResponse(200, folder, "Folder Updated"));
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // const folder = await Folder.findByIdAndDelete(id);
  const folder = await Folder.findById(id);

  if (folder) {
    //note : deleting all children folders
    await Folder.deleteMany({
      path: {
        $regex: `${folder.id}`,
      },
    });

    //note : deleting all code snippets in the folder
    await CodeSnippet.deleteMany({
      path: {
        $regex: `${folder.path}`,
      },
    });

    await folder.deleteOne();
  }

  if (!folder) {
    throw new ApiError(404, "Folder not found", [
      {
        folder: "Folder not found",
      },
    ]);
  }

  res.status(200).json(new ApiResponse(200, {}, "Folder Deleted"));
});

export const getRecentlyOpenedFolders = asyncHandler(async (req, res) => {
  const folder = await Folder.find({
    createdBy: req.user._id,
  })
    .sort({ lastOpened: -1 })
    .limit(10);

  res.status(200).json(new ApiResponse(200, folder, "Folder Fetched"));
});
