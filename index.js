import mongoose from "mongoose";
import ERROR_TYPES from "./constants/errorTypes.js";
import CastErrorHandler from "./errors/CastError.js";
import DuplicateKeyErrorHandler from "./errors/DuplicateKeyError.js";
import ValidationErrorHandler from "./errors/ValidationError.js";

class MongooseErrorHandler {
  static handle(err) {
    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
      return new ValidationErrorHandler(err).handleValidationError(err);
    } else if (err instanceof mongoose.CastError) {
      return new CastErrorHandler(err).handleCastError(err);
    } else if (err.name === ERROR_TYPES.DUPLICATE_KEY[1] && err.code && err.code.toString() === ERROR_TYPES.DUPLICATE_KEY[0]) {
      return new DuplicateKeyErrorHandler(err).handleDuplicateKeyError(err);
    } else {
      // fallback if mongoose error type is not found
      return {
        type: "unknown",
        message: err.message || "Something went wrong",
      };
    }
  }
}
export default MongooseErrorHandler;
