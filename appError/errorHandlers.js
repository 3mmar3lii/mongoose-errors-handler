class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperational = true;

    // Prevents prototype pollution attacks
    Error.captureStackTrace(this, this.constructor);
  }
}

export {
  AppError,
};
