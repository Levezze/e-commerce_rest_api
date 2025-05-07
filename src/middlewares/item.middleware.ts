import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export const possibleMediaTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug(`Middleware: Checking for valid item type param.`);
  try {

  } catch (error) {
    throw error;
  }
}



// import { Request, Response, NextFunction } from "express";
// import { logger } from "../utils/logger.js";


export const validateRequestBody = (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn({ errors: error.flatten().fieldErrors },
          'Input validation failed');
      } else {
        logger.error({ error }, 'Unexpected error during validation middleware');
      }
      next(error);
    };
  };
