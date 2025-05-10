import { Schema, model } from "mongoose";

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    path: {
      type: String,
      trim: true,
      default: "~/",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required"],
    },
    depth: {
      type: Number,
      default: 1,
    },
    lastOpened: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
export const Folder = model("Folder", folderSchema);
