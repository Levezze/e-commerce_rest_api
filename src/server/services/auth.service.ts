import { Insertable, Selectable } from 'kysely';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { db } from '../../db/index.js';
import { Users } from '../../db/types.js';
import { logger } from '../../utils/logger.js';
import { User } from '../../dtos/user.js';
import { RegisterUser } from '../../dtos/registerUser.js';

type NewUserForDb = Insertable<Users>; // What Kysely expects for .values()
type DbUser = Selectable<Users>; // What Kysely returns from .returningAll()

export const verifyCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {
  let query = db.selectFrom('users');
  const userFromDb = await query
    .where('email', '=', email)
    .selectAll ()
    .executeTakeFirst();

  if (!userFromDb) {
    logger.info(`Login failed: User ${email} not found`)
    return null;
  };

  if (!userFromDb.password) {
    logger.error(`User ${email} found but is missing password hash`);
    return null;
  };

  const isValid = await bcrypt.compare(password, userFromDb.password);

  if (isValid) {
    const {
      password: _password,
      password_reset_token: _token,
      password_reset_expires: _expires,
      ...userWithoutPassword
    } = userFromDb;

    const userDto: User = {
      id: userWithoutPassword.id,
      username: userWithoutPassword.username,
      email: userWithoutPassword.email,
      role: userWithoutPassword.user_role,
      created_at: userWithoutPassword.created_at.toISOString(),
      last_login: userWithoutPassword.last_login
        ? userWithoutPassword.last_login.toISOString()
        : undefined,
    };
    return userDto;
  } else {
    logger.info(`Login failed: Invalid password`);
    return null;
  };
};

export const generateJwtToken = async (user: User): Promise<string> => {
  logger.info(`Generating token for user ID: ${user.id}`);
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET env variable is not set!');
      throw new Error('JWT secret is not configured');
    };
    const secretKey = new TextEncoder().encode(secret);
    const algorithm = 'HS256';

    const payload = {
      sub: user.id.toString(),
      role: user.role,
      email: user.email,
    };

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setSubject(user.id.toString())
      .setExpirationTime('24h')
      .setIssuer('ErinWongJewelry')
      .sign(secretKey)
    
    logger.info(`Token generated successfully for user ID: ${user.id}`);
    return token;
  } catch (error) {
    logger.error('Error generating JWT', error);
    throw new Error('Failed to generate authentication token.');
  };
};

export const registerUser = async (userData: RegisterUser): Promise<User> => {
  logger.info(`Service: Registration attempt for email: ${userData.email}`);
  try {
    const userFromDb = await db.selectFrom('users')
      .where('email', '=', userData.email)
      .selectAll ()
      .executeTakeFirst();
  
    if (userFromDb) {
      logger.error(`User with email: ${userData.email} already exists.`)
      throw new Error('EMAIL_EXISTS');
    };

    logger.debug('Hashing password with bcrypt');
    
    const saltRounds = 10;
    const hash = await bcrypt.hash(userData.password, saltRounds);

    const newUserDbData: Omit<NewUserForDb,
      'id' | 'created_at' | 'is_active' | 'last_login' | 'password_reset_expires' | 'password_reset_token'
      > = {
        username: userData.username,
        email: userData.email,
        password: hash,
        user_role: 'customer'
      };
        
    const columnsToReturn = [
      'id', 
      'username', 
      'email', 
      'user_role',
      'created_at', 
      'updated_at', 
      'last_login'
    ] as const;

    const registerResult = await db.insertInto('users')
      .values(newUserDbData)
      .returning(columnsToReturn)
      .executeTakeFirstOrThrow()
    
    logger.info(`User registered successfully: ${registerResult.email} (ID: ${registerResult.id})`);

    const userDto: User = {
      id: registerResult.id,
      username: registerResult.username,
      email: registerResult.email,
      role: registerResult.user_role,
      created_at: registerResult.created_at.toISOString(),
      updated_at: registerResult.updated_at.toISOString(),
      last_login: registerResult.last_login?.toISOString(),
    }

    return userDto;
  } catch (error: any) {
    logger.error('Error during user registration:', error);
    if (error.message === 'EMAIL_EXISTS') throw error;
    throw new Error('User registration failed due to an unexpected error.');
  };
};

