import { Request, Response, NextFunction } from "express";
import * as itemService from '../services/item.public.service.js';
import { Item } from "../../../dtos/generated/item.js";
import { logger } from "../../../utils/logger.js";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";

export const handleGetItems = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  logger.info('Attempting to fetch all items.');
  try {
    const admin = req.query.admin === 'true';
    const response = await itemService.getAllItems(admin);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const handleGetItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const itemId = typeof req.query.id === 'string' ? req.query.id : '';
    if (itemId === '') {
      throw new BadRequestError('Item ID must be provided.');
    };

    const isAdmin = req.query.admin === 'true';
    logger.info(`Attempting to fetch item with ID ${itemId}.`);
    const response = await itemService.getItemById(parseInt(itemId), isAdmin)
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      next(error);
    }
  }
}