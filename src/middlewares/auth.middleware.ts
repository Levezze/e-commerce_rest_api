import * as jose from 'jose';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface UserJWTPayload extends jose.JWTPayload {
  sub: string;
  role: string;
  email?: string;
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  logger.fatal('FATAL ERROR: JWT_SECRET environment variable is not set!');
  throw new Error('JWT_SECRET environment variable is not set!');
};

const jwtSecretUint8Array = new TextEncoder().encode(jwtSecret);

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug('Auth middleware triggered');
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) { // Makes sure it's a bearer token
      logger.warn('Auth failed: No bearer token provided or incorrect format.');
      res.status(401).json({
        message: 'Unauthorized: Access token is missing or malformed'
      });
      return;
    };

    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.warn('Auth failed: Token missing after "Bearer ".');
      res.status(401).json({
        message: 'Unauthorized: Access token is missing'
      });
      return;
    };

    const { payload } = await jose.jwtVerify<UserJWTPayload>(token, jwtSecretUint8Array);

    logger.debug(`Token verified for user sub: ${payload.sub}`);
    req.user = payload;
    next();
  } catch (error: any) {
    logger.warn(`Auth failed: ${error.name} - ${error.message}`);
    let message = 'Unauthorized: Invalid token';
    if (error.code === 'ERR_JWT_EXPIRED') {
      message = 'Unauthorized: Token expired';
    };
    res.status(401).json({ message: message });
  };
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug('Admin auth middleware triggered');
  try {
    const userRole = req.user?.role;

    if (!userRole) {
      logger.warn("User role not defined or can't be fetched");
      res.status(403).json({ message: 'User role is missing' });
    }

    if (userRole !== 'admin') {
      logger.warn(`User ID ${req.user?.sub} has no admin privilages.`);
      res.status(403).json({ message: 'User has no admin privilages. ' });
    }

    logger.debug('User has admin privilages');
    next();
  } catch (error: any) {
    logger.warn(`Admin auth failed: ${error.name} - ${error.message}`);
    res.sendStatus(403);
  };
};