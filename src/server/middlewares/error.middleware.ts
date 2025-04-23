import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger.js";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  };

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details: any = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Input validation failed';
    details = err.flatten().fieldErrors;
    logger.info(`Validation Error Details: ${JSON.stringify(details)}`);
  };

  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected error occurred.';
  };

  res.status(statusCode).json({
      error: {
          message: message,
          details: details,
          status: statusCode,
      }
  });
};