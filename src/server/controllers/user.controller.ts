import { Request, Response, NextFunction } from "express";
import * as userService from '../services/user.service.js'

export const handleGetUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsersArray = await userService.getAllDbUsers();
    res.status(200).json(allUsersArray);
  } catch (error: any) {
    next(error);
  };
};