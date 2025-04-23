import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { RegisterUser } from '../../dtos/registerUser.js';
import { LoginRequest } from '../../dtos/loginRequest.js';
import { User } from '../../dtos/user.js';
import { AuthSession } from '../../dtos/authSession.js';
import { UserJWTPayload } from '../middlewares/auth.middleware.js'
import { logger } from '../../utils/logger.js';
import { unknown } from 'zod';

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUserInput = req.body as RegisterUser
    const createdUser: User = await authService.registerUser(newUserInput)
    res.status(201).json(createdUser);
  } catch (error: any) {
    if (error.message == 'EMAIL_EXISTS') {
      res.status(409).json({ message: 'Email address is already in use.' });
      return;
    }
    next(error);
  };
};

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as LoginRequest;
  try {
    const user = await authService.verifyCredentials(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' }); 
      return;
    };

    const generatedToken = await authService.generateJwtToken(user);
    const responseBody: AuthSession = {
      token: generatedToken, 
      user: user
    };

    res.status(200).json(responseBody);
  } catch (error: any) {
    next(error);
  };
};

export const handleGetMe = async (req: Request, res: Response, next: NextFunction) => {
  const userPayload = req.user as UserJWTPayload;
  
  logger.debug(`Handling /me request for user sub: ${userPayload?.sub}`);
  
  try {
    const userIdString = userPayload?.sub;
    if (!userIdString) {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload (missing sub).' });
      return;
    };
    const userId = parseInt(userIdString, 10);
    if (isNaN(userId)) {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload (missing sub).' });
      return;
    };

    const user: User | null = await userService.findUserById(userId);
    if (!user) {
      logger.warn(`User ID ${userId} from valid token not found in database.`);
      res.status(404).json({ message: 'User not found' });
      return;
    };

    logger.debug({ userReceivedInController: user }, "User object received from service");

    logger.debug(`Successfully retrieved user data for ID: ${userId}`);
    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Error in handleGetMe for sub ${userPayload?.sub}:`, error);
    next(error);
  };
};

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.sub;
  logger.debug(`Handling logout of user ID: ${userId || unknown}, token removal is client-side`);
  res.sendStatus(204);
  logger.info('User successfully logged out');
};
