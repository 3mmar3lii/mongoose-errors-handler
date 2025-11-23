import { Error as MongooseError } from 'mongoose';

/**
 * Custom error class for operational errors
 */
export class AppError extends Error {
  /**
   * HTTP status code (400, 404, 500, etc.)
   */
  statusCode: number;

  /**
   * Error status: "fail" for 4xx errors, "error" for 5xx errors
   */
  status: string;

  /**
   * Flag indicating if this is an operational error (true) or programming bug (false)
   */
  isOperational: boolean;

  /**
   * Creates a new AppError instance
   * @param message - Error message
   * @param statusCode - HTTP status code
   */
  constructor(message: string, statusCode: number);
}

/**
 * Result type for unknown errors
 */
export interface UnknownErrorResult {
  /**
   * Always "unknown" for unhandled errors
   */
  type: 'unknown';

  /**
   * Error message
   */
  message: string;
}

/**
 * Main error handler class for Mongoose errors
 */
export default class MongooseErrorHandler {
  /**
   * Handles Mongoose errors and transforms them into user-friendly responses
   * 
   * @param err - The error object to handle
   * @returns AppError instance for Mongoose errors, or plain object for unknown errors
   * 
   * @example
   * ```typescript
   * try {
   *   await User.create({ email: 'invalid' });
   * } catch (err) {
   *   const handled = MongooseErrorHandler.handle(err);
   *   console.log(handled.message);
   *   console.log(handled.statusCode);
   * }
   * ```
   */
  static handle(err: Error | MongooseError): AppError | UnknownErrorResult;
}
