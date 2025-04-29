import { Request, Response, NextFunction } from "express";
import * as itemService from '../item.service.js';

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await itemService.getAllItems();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
