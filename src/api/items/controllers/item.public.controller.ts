import { Request, Response, NextFunction } from "express";
import * as itemService from '../services/item.public.service.js';
import { Item } from "../../../dtos/generated/item.js";

export const getItems = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const admin = req.query.admin === 'true';
    const response = await itemService.getAllItems(admin);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
