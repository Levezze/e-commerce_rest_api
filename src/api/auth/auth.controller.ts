import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import * as userService from '../users/user.service.js';
// Dtos
import { z } from 'zod';
import { schemas } from '../../dtos/custom/zod.js';
import { logger } from '../../utils/logger.js';
import { unknown } from 'zod';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors.js';

type LoginRequest = z.infer<typeof schemas.LoginRequest>;
type RegisterRequest = z.infer<typeof schemas.RegisterUser>;
type UserSelfResponse = z.infer<typeof schemas.UserSelf>;
type UserTokenResponse = z.infer<typeof schemas.UserWithToken>;

// Register Handler
export const handleRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUserInput = req.body as RegisterRequest
    const createdUser: UserSelfResponse = await authService.registerUser(newUserInput)
    res.status(201).json(createdUser);
  } catch (error: any) {
    if (error instanceof ConflictError) {
      res.status(error.statusCode).json({ message: error.message });
      return
    }
    next(error);
  };
};

// Login Handler
export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as LoginRequest;
    const user = await authService.verifyCredentials(email, password);
    logger.debug(`Credentials verified for user sub: ${user.id}, generating token.`);

    const generatedToken: UserTokenResponse = await authService.generateJwtToken(user);
    logger.debug(`Token generated for user sub: ${user.id}`);

    res.status(200).json(generatedToken);

  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  };
};

export const handleLogout = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.user?.sub;
  logger.debug(`Handling logout of user ID: ${userId || unknown}, token removal is client-side`);
  res.sendStatus(204);
  logger.info('User successfully logged out');
};

// Get Me Handler
export const handleGetMe = async (req: Request, res: Response, next: NextFunction) => {
  const userSub = req.user?.sub as string;
  const isCustomer = req.user?.role === 'customer';

  logger.debug(`Handling /me fetch for user sub: ${userSub}`);

  try {
    if (!userSub) {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload (missing sub).' });
      return;
    };
    const userId = parseInt(userSub, 10);
    if (isNaN(userId)) {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload (missing sub).' });
      return;
    };

    const user: UserSelfResponse | null = await userService.findUserById(userId);

    logger.debug({ userReceivedInController: user }, "User object received from service");

    logger.debug(`Successfully retrieved user data for ID: ${userId}`);
    res.status(200).json(user);

  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    };
    logger.error(`Error in handleGetMe for sub ${userSub}:`, error);
    next(error);
  };
};

// Update Me Handler
export const handleUpdateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updatedValues = req.body;
  const userSub = req.user?.sub as string;
  logger.debug(`Handling /me update for user sub: ${userSub}`);
  try {
    const updatedUser = await authService.updateSelf(parseInt(userSub), updatedValues);
    logger.info(`Successfully updated user ${updatedUser.email}`);
    res.status(200).json(updatedUser);

  } catch (error: any) {
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError ||
      error instanceof ConflictError
    ) {
      res.status(error.statusCode).json({ message: error.message });
    };
    logger.error(`Error in handleUpdateMe for sub ${userSub}`, error);
    next(error);
  };
};
