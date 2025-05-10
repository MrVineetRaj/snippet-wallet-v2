import { ApiError } from "./api.error.js";

const asyncHandler = (requestHandler) => {
  // info : requestHandler is a function which is passed as a parameter here

  if (typeof requestHandler !== "function") {
    throw new Error(
      `Expected a function but received ${typeof requestHandler} `
    );
  }

  // info : i assume that this will be used with express controllers so req,res,next will be injected by express
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // console.log(err);
      next(err);
    });
  };
  // return async (req, res, next) => {
  //   try {
  //     await requestHandler(req, res, next);
  //   } catch (err) {
  //     console.log("Here");
  //     next(err);
  //   }
  // };
};

export { asyncHandler };
