import MongooseErrorHandler from "./index.js";

/**
 * Express middleware for handling Mongoose errors automatically
 * 
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * 
 * @example
 * import { errorMiddleware } from 'mongoose-error-handler';
 * 
 * app.use(errorMiddleware);
 */
export const errorMiddleware = (err, req, res, next) => {
  const handledError = MongooseErrorHandler.handle(err);
  
  // If it returns an AppError instance (has statusCode)
  if (handledError.statusCode) {
    return res.status(handledError.statusCode).json({
      success: false,
      error: handledError.message,
    });
  }
  
  // If it returns a plain object (unknown error)
  return res.status(500).json({
    success: false,
    error: handledError.message,
    type: handledError.type,
  });
};

/**
 * Async handler wrapper for Express routes
 * Automatically catches and handles Mongoose errors
 * 
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 * 
 * @example
 * import { asyncHandler } from 'mongoose-error-handler';
 * 
 * app.post('/users', asyncHandler(async (req, res) => {
 *   const user = await User.create(req.body);
 *   res.json({ success: true, data: user });
 * }));
 */
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      const handledError = MongooseErrorHandler.handle(err);
      
      if (handledError.statusCode) {
        return res.status(handledError.statusCode).json({
          success: false,
          error: handledError.message,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: handledError.message,
        type: handledError.type,
      });
    }
  };
};

export default errorMiddleware;
