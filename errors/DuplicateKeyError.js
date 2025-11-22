import { AppError } from "../appError/errorHandlers.js";
import ERROR_TYPES from "../constants/errorTypes.js";

class DuplicateKeyErrorHandler {
  constructor(err) {
    this.type = ERROR_TYPES.DUPLICATE_KEY[1];
    this.keyValue = err.keyValue;
  }

  handleDuplicateKeyError(err) {
  if (!err.keyValue) {
    return new AppError('Duplicate field value entered', 400);
  }
  const value = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate field value: ${value}. Please use another one!`,
    400
  );
}
}

export default DuplicateKeyErrorHandler;
