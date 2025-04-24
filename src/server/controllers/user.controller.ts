import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger.js";
import * as userService from '../services/user.service.js'
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";

export const handleGetUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info(`Fetching all users`);
    const allUsersArray = await userService.getAllDbUsers();
    res.status(200).json(allUsersArray);
  } catch (error: any) {
    next(error);
  };
};

export const handleDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.id);
  try {
    logger.info(`deleting user ID: ${userId}`);
    const deletedUser = await userService.deleteUserById(userId);
    logger.info('User deleted successfully', deletedUser);
    res.sendStatus(204);
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      next(error);
    }
  };
};