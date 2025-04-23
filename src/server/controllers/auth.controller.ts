import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { RegisterUser } from '../../dtos/registerUser.js';
import { LoginRequest } from '../../dtos/loginRequest.js';
import { User } from '../../dtos/user.js';
import { AuthSession } from '../../dtos/authSession.js';

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

