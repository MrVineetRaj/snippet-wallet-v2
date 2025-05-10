class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    if (data) {
      this.data = data;
    }
    this.statusCode = statusCode < 400;
  }
}

export { ApiResponse };
