import { Folder } from "../database/models/folder.model.js";
import { asyncHandler } from "../utils/async.handler.js";
import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import { CodeSnippet } from "../database/models/codesnippet.model.js";
import mongoose, { Schema } from "mongoose";

export const createCodeSnippet = asyncHandler(async (req, res) => {
  const { name, description, path, programmingLanguage, code } = req.body;

  if (!name || !path || !programmingLanguage || !code) {
    throw new ApiError(
      400,
      "Name, path, programmingLanguage, code required are required",
      [
        {
          CodeSnippet:
            "Name, path, programmingLanguage, code required are required",
        },
      ]
    );
  }

  if (!path.startsWith("~") || !path.endsWith("/")) {
    throw new ApiError(400, "Invalid Path", [
      {
        codeSnippetPath: "Path should start with ~ and end with /",
      },
    ]);
  }

  const pathSegments = path.split("/");
  const parentFolder = pathSegments[pathSegments.length - 2];

  const isValidParent =
    parentFolder === "~" ? true : mongoose.Types.ObjectId.isValid(parentFolder);

  if (!isValidParent) {
    throw new ApiError(400, "Invalid Parent Folder", [
      {
        parent: "Parent folder should be a valid ObjectId",
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

  const codeSnippet = new CodeSnippet({
    name,
    description: description || undefined,
    path,
    createdBy: req.user._id,
    programmingLanguage,
    code,
  });

  await codeSnippet.save();

  res
    .status(201)
    .json(new ApiResponse(201, codeSnippet, "Code Snippet Created"));
});

export const getCodeSnippetByPath = asyncHandler(async (req, res) => {
  const { path } = req.query;

  const codeSnippets = await CodeSnippet.find({
    path: `${path || "~/"}`,
  });
  res
    .status(200)
    .json(new ApiResponse(200, codeSnippets, "Code snippets Fetched"));
});

export const getCodeSnippet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Code Snippet ID is required", [
      {
        CodeSnippetId: "Code Snippet ID is required",
      },
    ]);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Code Snippet ID", [
      {
        CodeSnippetId: "Code Snippet ID should be a valid ObjectId",
      },
    ]);
  }

  const codeSnippet = await CodeSnippet.findByIdAndUpdate(
    id,
    {
      lastOpened: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!codeSnippet) {
    throw new ApiError(404, "Code snippet not found", [
      {
        CodeSnippet: "Code snippet not found",
      },
    ]);
  }
  res
    .status(200)
    .json(new ApiResponse(200, codeSnippet, "Code snippet Fetched"));
});

export const updateCodeSnippet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, programmingLanguage, code } = req.body;

  const fieldToUpdate = {};
  if (name) fieldToUpdate.name = name;
  if (description) fieldToUpdate.description = description;
  if (programmingLanguage) fieldToUpdate.programmingLanguage = programmingLanguage;
  if (code) fieldToUpdate.code = code;

  if (!id) {
    throw new ApiError(400, "Code Snippet ID is required", [
      {
        CodeSnippetId: "Code Snippet ID is required",
      },
    ]);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Code Snippet ID", [
      {
        CodeSnippetId: "Code Snippet ID should be a valid ObjectId",
      },
    ]);
  }
  const codeSnippet = await CodeSnippet.findByIdAndUpdate(
    id,
    {
      ...fieldToUpdate,
      lastOpened: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!codeSnippet) {
    throw new ApiError(404, "Code snippet not found", [
      {
        CodeSnippet: "CodeSnippet not found",
      },
    ]);
  }

  res
    .status(200)
    .json(new ApiResponse(200, codeSnippet, "Code snippet Updated"));
});

export const deleteCodeSnippet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const codeSnippet = await CodeSnippet.findByIdAndDelete(id);

  if (!codeSnippet) {
    throw new ApiError(404, "Folder not found", [
      {
        CodeSnippet: "CodeSnippet not found",
      },
    ]);
  }

  res.status(200).json(new ApiResponse(200, {}, "Code snippet Deleted"));
});
