class ApiError extends Error {
  constructor(
    statusCode, //info : Most important stuff while building Error handler
    message = "Something went Wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      this.stack = Error.captureStackTrace(this);
    }

    
  }
}

export { ApiError };
