import { sql, Insertable, Selectable, Updateable } from 'kysely';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { db } from '../../database/index.js';
import { Users as UsersTableInterface } from '../../database/types.js';
import { logger } from '../../utils/logger.js';
import { User } from '../../dtos/user.js';
import { RegisterUser } from '../../dtos/registerUser.js';
import { UpdatedUserResponse } from '../../dtos/UpdatedUserResponse.js';
import { BadRequestError, 
  ConflictError, 
  NotFoundError, 
  UnauthorizedError } from '../../utils/errors.js';
import { PartialUserUpdate } from '../../dtos/partialUserUpdate.js';


type UserForDb = Insertable<UsersTableInterface>;
type SelectableDbUser = Selectable<UsersTableInterface>;

export const verifyCredentials = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const queryResult = await sql<SelectableDbUser>`
    SELECT *
    FROM users
    WHERE email = ${email};
    `.execute(db);

    const userFromDb = queryResult.rows[0]

    if (queryResult.rows.length === 0) {
      throw new UnauthorizedError(`Login failed: User ${email} not found`)
    };

    if (!userFromDb.password) {
      throw new UnauthorizedError(`User ${email} found but is missing password hash`);
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

  } catch (error: any) {
    logger.error('Error generating JWT', error);
    throw new Error('Failed to generate authentication token.');
  };
};

export const registerUser = async (userData: RegisterUser): Promise<User> => {
  logger.info(`Service: Registration attempt for email: ${userData.email}`);
  try {
    const getUserQueryResult = await sql<SelectableDbUser>`
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

    const newUserDbData: Omit<UserForDb,
      'id' | 'created_at' | 'is_active' | 'last_login' | 'password_reset_expires' | 'password_reset_token'
      > = {
        username: userData.username,
        email: userData.email,
        password: hash,
        user_role: 'customer'
      };
    
    const registerUserQueryResult = await sql<SelectableDbUser>`
    INSERT INTO users (username, email, password, user_role)
    VALUES (${newUserDbData.username}, ${newUserDbData.email}, ${newUserDbData.password}, ${newUserDbData.user_role})
    RETURNING id, username, email, user_role, created_at, updated_at, last_login;
    `.execute(db);

    const registerResult = registerUserQueryResult.rows[0];
    
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
    if (error instanceof ConflictError) {
      throw error;
    } else {
      logger.error('Error during user registration:', error);
      throw new Error('User registration failed due to an unexpected error.');
    };
  };
};

export const updateUser = async (id: number, updatedValues: PartialUserUpdate) => {
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

    const userDto: UpdatedUserResponse = {
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