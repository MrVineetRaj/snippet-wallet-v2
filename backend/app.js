import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//note : importing utils
import { corsOptions } from "./utils/constants.js";
import { ApiError } from "./utils/api.error.js";

//note : Importing Routes
import authRoutes from "./routes/auth.routes.js";
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import codeSnippetRoutes from "./routes/codesnippet.routes.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//note : Using Routes
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/folder", folderRoutes);
app.use("/api/v1/codesnippet", codeSnippetRoutes);

//note : global error handler
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    errors: [
      {
        message: err.message,
      },
    ],
  });
});

export default app;
