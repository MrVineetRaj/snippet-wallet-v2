import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      connectTimeoutMS: 30 * 1000,
    });
    console.log("MongoDB connected!");
  } catch (error) {
    throw new Error(error);
  }
};

export default connectDB;
