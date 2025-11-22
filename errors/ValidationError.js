import { AppError } from "../appError/errorHandlers.js";
import ERROR_TYPES from "../constants/errorTypes.js";

class ValidationErrorHandler {
  constructor(err) {
    this.type = ERROR_TYPES.VALIDATION_ERROR;
    this.message = err.message;
    this.errors = err.errors;
  }

  handleValidationError(err) {
      if (!err.errors) {
    return new AppError(`Validation error: ${err.message || 'Unknown validation error'}`, 400);
  }
  const errors = Object.values(err.errors)
    .map((e) => e.message)
    .join(", ");
  return new AppError(`Validation error: ${errors}`, 400);
  }
}

export default ValidationErrorHandler;
