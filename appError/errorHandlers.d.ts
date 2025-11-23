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
