import { Request, Response, NextFunction } from "express";
import { logger } from "../../../utils/logger.js";
import { MediaTypes } from "../../../dtos/custom/customTypes.js";

export const possibleMediaTypes = async () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug(`Middleware: Checking for valid item type param.`);
  try {
    
  }
}
