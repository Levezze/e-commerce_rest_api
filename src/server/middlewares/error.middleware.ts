import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected error occurred.';
  }

  res.status(statusCode).json({
      error: {
          message: message,
          // status: statusCode // Optionally include status code
      }
  });
};