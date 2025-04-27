import {
  type Interceptor,
  type QueryResultRow,
  SchemaValidationError,
} from "slonik";
import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger.js";

export const createResultParserInterceptor = (): Interceptor => {
  return {
    // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
    // Future versions of Zod will provide a more efficient parser when parsing without transformations.
    // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
    // transform results as needed in `transformRow`.
    transformRow: async (executionContext, actualQuery, row) => {
      const { log, resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      // It is recommended (but not required) to parse async to avoid blocking the event loop during validation
      const validationResult = await resultParser.safeParseAsync(row);

      if (!validationResult.success) {
        throw new SchemaValidationError(
          actualQuery,
          row,
          validationResult.error.issues
        );
      }

      return validationResult.data as QueryResultRow;
    },
  };
};

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
