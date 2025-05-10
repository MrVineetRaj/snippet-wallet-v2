import { Schema, model } from "mongoose";

const codesnippetSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    path: {
      type: [String],
      trim: true,
      default: "~/",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required"],
    },
    programmingLanguage: {
      type: String,
      required: [true, "Programming language is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      trim: true,
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

export const CodeSnippet = model("CodeSnippet", codesnippetSchema);
