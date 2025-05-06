import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import * as userService from '../users/user.service.js';
// Dtos
import { components } from '../../dtos/generated/openapi.js';
import { UserJWTPayload } from './auth.middleware.js'
import { logger } from '../../utils/logger.js';
import { unknown } from 'zod';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors.js';

type LoginRequest = components["schemas"]["LoginRequest"];
type RegisterRequest = components["schemas"]["RegisterUser"];
type UserSelfResponse = components["schemas"]["UserSelf"];
type UserTokenResponse = components["schemas"]["UserWithToken"];

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

export const handleLogin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as LoginRequest;
    const user = await authService.verifyCredentials(email, password);
    const generatedToken: UserTokenResponse = await authService.generateJwtToken(user);

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

export const handleGetMe = async (req: Request, res: Response, next: NextFunction) => {
  const userSub = req.user?.sub as string;
  
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

export const handleUpdateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updatedValues = req.body;
  const userSub = req.user?.sub  as string;
  logger.debug(`Handling /me update for user sub: ${userSub}`);
  try {
    const updatedUser = await authService.updateUser(parseInt(userSub), updatedValues);
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
