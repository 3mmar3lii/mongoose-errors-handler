import ERROR_TYPES from "./constants/errorTypes.js";
import CastErrorHandler from "./errors/CastError.js";
import DuplicateKeyErrorHandler from "./errors/DuplicateKeyError.js";
import ValidationErrorHandler from "./errors/ValidationError.js";

class MongooseErrorHandler {
  static handle(err) {
    switch (err.name) {
      case ERROR_TYPES.VALIDATION_ERROR:
        return new ValidationErrorHandler(err).handleValidationError(err);      
      case ERROR_TYPES.CAST_ERROR:
        return new CastErrorHandler(err).handleCastError(err);
      case ERROR_TYPES.DUPLICATE_KEY[1]:
        if (err.code && err.code.toString() === ERROR_TYPES.DUPLICATE_KEY[0]) {
          return new DuplicateKeyErrorHandler(err).handleDuplicateKeyError(err);
        }
        // fallback if mongoose error type is not found 
        return {
          type: "unknown",
          message: err.message || "Something went wrong",
        };
      default:
        return {
          type: "unknown",
          message: err.message || "Something went wrong",
        };
    }
  }
}
export default MongooseErrorHandler;
