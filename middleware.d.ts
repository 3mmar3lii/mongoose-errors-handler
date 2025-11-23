import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express middleware for handling Mongoose errors automatically
 * 
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * @example
 * ```typescript
 * import { errorMiddleware } from 'mongoose-errors-handler/middleware';
 * 
 * app.use(errorMiddleware);
 * ```
 */
export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void;

/**
 * Wrapper for async route handlers that automatically catches errors
 * 
 * @param fn - Async route handler function
 * @returns Express middleware function
 * 
 * @example
 * ```typescript
 * import { asyncHandler } from 'mongoose-errors-handler/middleware';
 * 
 * app.post('/users', asyncHandler(async (req, res) => {
 *   const user = await User.create(req.body);
 *   res.json({ success: true, data: user });
 * }));
 * ```
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler;

export default errorMiddleware;
