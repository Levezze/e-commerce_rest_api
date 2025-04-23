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
