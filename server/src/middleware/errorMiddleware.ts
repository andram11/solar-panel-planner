
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is an instance of AppError, then it will have a statusCode
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'An unexpected error occurred';

  // Log the error stack trace 
  console.error(err);

  // Return generic error message
  res.status(statusCode).json({
    status: 'error',
    message: message,
    // Optional: include the stack trace in non-production environments
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
