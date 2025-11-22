import { AppError } from "../appError/errorHandlers.js";
import ERROR_TYPES from "../constants/errorTypes.js";

class CastErrorHandler {
  constructor(err) {
    this.type = ERROR_TYPES.CAST_ERROR;
  }

  handleCastError(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  }
}

export default CastErrorHandler;
