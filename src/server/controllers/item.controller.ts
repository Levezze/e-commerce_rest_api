import { Request, Response, NextFunction } from "express";
import * as itemService from '../services/item.service';
import { NewItemInput } from "../../dtos/newItemInput";

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newItemData = req.body as NewItemInput;
    const response = await itemService.createNewItem(newItemData);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};