import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger.js";

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
