import { sql, Insertable, Selectable } from 'kysely';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { logger } from '../../utils/logger.js';
import { db } from '../../database/index.js';
// Db Inferred Types
import { Users as UsersTableInterface } from '../../database/types.js';
// Dtos
import { z } from "zod";
import { schemas } from "../../dtos/custom/zod.js";
import { transformValidate } from "../../utils/transformValidate.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError
} from '../../utils/errors.js';
import camelcaseKeys from "camelcase-keys";


type NewUserDb = Insertable<UsersTableInterface>;
type DbUser = Selectable<UsersTableInterface>;
type UserSelfResponse = z.infer<typeof schemas.UserSelf>;
type UserAdminResponse = z.infer<typeof schemas.UserAdmin>;
type UserTokenResponse = z.infer<typeof schemas.UserWithToken>;
type UserRegisterInput = z.infer<typeof schemas.RegisterUser>;
type UserUpdateMe = z.infer<typeof schemas.UpdateMe>;

export const verifyCredentials = async (
  email: string,
  password: string
): Promise<UserSelfResponse> => {
  try {
    const queryResult = await sql<DbUser>`
    SELECT *
    FROM users
    WHERE email = ${email};
    `.execute(db);

    const userFromDb = queryResult.rows[0]
    if (queryResult.rows.length === 0) {
      throw new UnauthorizedError(`Login failed: User ${email} not found`)
    };
    if (!userFromDb.password_hash) {
      throw new UnauthorizedError(`User ${email} found but is missing password hash`);
    };
    const isValid = await bcrypt.compare(password, userFromDb.password_hash);

    if (isValid) {
      const {
        password_hash: _password,
        password_reset_token: _token,
        password_reset_expires: _expires,
        ...userWithoutPassword
      } = userFromDb;

      const userDto: UserSelfResponse = {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        email: userWithoutPassword.email,
        createdAt: userWithoutPassword.created_at.toISOString(),
      };

      return userDto;

    } else {
      throw new UnauthorizedError('Login failed: Invalid password');
    };
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      throw error;
    } else {
      logger.error(`Service: Failed to log in user ${email}`, error);
      throw new Error('User log in failed.');
    };
  }
};

export const generateJwtToken = async (user: UserSelfResponse): Promise<UserTokenResponse> => {
  logger.info(`Generating token for user ID: ${user.id}`);
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET env variable is not set!');
      throw new Error('JWT secret is not configured');
    };

    logger.debug(`JWT_SECRET env variable is set: ${secret}`);

    const secretKey = new TextEncoder().encode(secret);
    const algorithm = 'HS256';

    if (!user.id) {
      logger.error('User ID is missing');
      throw new Error('User ID is missing');
    };

    const payload = {
      sub: user.id?.toString(),
      email: user.email,
    };

    logger.debug(`payload: ${JSON.stringify(payload)}`);

    try {
      const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: algorithm })
        .setIssuedAt()
        .setSubject(user.id.toString())
        .setExpirationTime('24h')
        .setIssuer('http://localhost:3000')
        .sign(secretKey)

      logger.debug(`token: ${token}`);

      logger.info(`Token generated successfully for user ID: ${user.id}`);
      const userDto = {
        user: user,
        token: token,
      };
      return userDto;
    } catch (signError: any) {
      logger.error('Error signing JWT token:', signError.message);
      logger.error(signError.stack);
      throw new Error('Failed to sign JWT token.');
    };
  } catch (error: any) {
    logger.error('Error generating JWT', error.message);
    logger.error(error.stack);
    throw new Error('Failed to generate authentication token.');
  };
};

export const registerUser = async (userData: UserRegisterInput): Promise<UserSelfResponse> => {
  logger.info(`Service: Registration attempt for email: ${userData.email}`);
  try {
    const getUserQueryResult = await sql<DbUser>`
    SELECT *
    FROM users
    WHERE email = ${userData.email};
    `.execute(db);

    if (getUserQueryResult.rows.length > 0) {
      throw new ConflictError(`User with email: ${userData.email} already exists.`);
    };

    logger.debug('Hashing password with bcrypt');

    const saltRounds = 10;
    const hash = await bcrypt.hash(userData.password, saltRounds);

    const newUserDbData: Omit<NewUserDb, 'password_reset_expires' | 'password_reset_token'> = {
      username: userData.username,
      email: userData.email,
      password_hash: hash,
      user_role: 'customer',
    };

    const registerUserQueryResult = await sql<DbUser>`
    INSERT INTO users (username, email, password, user_role)
    VALUES (${newUserDbData.username}, 
    ${newUserDbData.email}, 
    ${newUserDbData.password_hash}, 
    ${newUserDbData.user_role})
    RETURNING id, username, email, created_at;
    `.execute(db);

    const registerResult = registerUserQueryResult.rows[0];

    logger.info(`User registered successfully: ${registerResult.email} (ID: ${registerResult.id})`);

    const userDto: UserSelfResponse = {
      id: registerResult.id,
      username: registerResult.username,
      email: registerResult.email,
      createdAt: registerResult.created_at.toISOString(),
    };
    return userDto;
  } catch (error: any) {
    if (error instanceof ConflictError) {
      throw error;
    } else {
      logger.error('Error during user registration:', error);
      throw new Error('User registration failed due to an unexpected error.');
    };
  };
};

export const updateSelf = async (id: number, updatedValues: UserUpdateMe) => {
  logger.info(`Service: User update attempt on ID: ${id}`);
  try {
    const columnsToReturn = [
      'id',
      'username',
      'email',
    ] as const;

    const updatedUser = await db
      .updateTable('users')
      .set(updatedValues)
      .where('id', '=', id)
      .returning(columnsToReturn)
      .executeTakeFirst();

    if (!updatedUser) {
      throw new NotFoundError(`Failed to find user with ID: ${id}`);
    };

    const userDto: Omit<UserSelfResponse, "createdAt"> = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    };

    return userDto;

  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError ||
      error instanceof ConflictError
    ) {
      throw error;
    } else {
      logger.error('Error during user update:', error);
      throw new Error('User update failed due to an unexpected error');
    };
  };
};
