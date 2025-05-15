import { db } from '../../database/index.js';
import { logger } from '../../utils/logger.js';
// import { User } from '../../dtos/generated/user.js';
import { z } from 'zod';
import { schemas } from '../../dtos/custom/zod.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';
import { sql, Selectable } from 'kysely';
import { Users as UsersTableInterface } from '../../database/types.js';

type SelectableDbUser = Selectable<UsersTableInterface>;
type UserResponse = z.infer<typeof schemas.UserSelf>;

export const findUserById = async (id: number) => {
  logger.debug(`Service: Fetching to get user by ID: ${id}`);
  try {
    const queryResult = await sql<SelectableDbUser>`
      SELECT id, 
        username, 
        email, 
        user_role, 
        created_at, 
        updated_at, 
        last_login
      FROM users
      WHERE id = ${id};
      `.execute(db);

    if (queryResult.rows.length === 0) {
      throw new NotFoundError(`Service: User with ID: ${id} not found.`);
    };

    const userFromDb = queryResult.rows[0];

    const userDto: UserResponse = {
      id: userFromDb.id,
      username: userFromDb.username,
      email: userFromDb.email,
      userRole: userFromDb.user_role,
      createdAt: userFromDb.created_at?.toISOString(),
      updatedAt: userFromDb.updated_at?.toISOString(),
      lastLogin: userFromDb.last_login?.toISOString(),
    };

    logger.debug({ userDtoFromService: userDto }, "Mapped user DTO in service");

    return userDto;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      logger.error(`Service: Error fetching user by ID ${id}`, error);
      throw new Error('Database error while fetching user details.');
    }
  };
};

export const getAllDbUsers = async () => {
  logger.debug(`Service: Fetching all users by admin`);
  try {
    const queryResult = await sql<SelectableDbUser>`
      SELECT id, username, email, user_role, created_at, updated_at, last_login
      FROM users
      `.execute(db);

    if (queryResult.rows.length === 0) {
      throw new NotFoundError(`Service: No users found.`);
    };

    const AllDbUsers = queryResult.rows;

    const usersDto: UserResponse[] = queryResult.rows.map(dbUser => {
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.user_role,
        createdAt: dbUser.created_at?.toISOString(),
        updatedAt: dbUser.updated_at?.toISOString(),
        lastLogin: dbUser.last_login?.toISOString(),
      }
    });

    if (AllDbUsers.length === 0) {
      logger.info('No users were found in the database');
    } else {
      logger.debug({ userCount: usersDto.length }, "Mapped users DTO array in service");
    }
    return usersDto;
  } catch (error: any) {
    logger.error(`Service: Error fetching all users`, error);
    throw new Error(`Database error while fetching all users.`);
  };
};

export const deleteUserById = async (id: number) => {
  logger.debug(`Service: Attempting to delete user with ID: ${id}`);
  try {

    const userQueryResult = await sql<SelectableDbUser>`
    SELECT (id, username, email)
    FROM users
    WHERE id = ${id};
    `.execute(db);

    const dbUser = userQueryResult.rows[0];

    if (userQueryResult.rows.length === 0) {
      throw new NotFoundError(`User with ID ${id} not found.`);
    };

    if (dbUser.username === 'admin') {
      throw new ForbiddenError(`Cannot delete the primary admin user.`);
    };

    logger.debug(`User ${dbUser?.email} was found, proceeding to delete.`);

    await sql`
    DELETE FROM users
    WHERE id = ${id};
    `.execute(db);

    return true;
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    } else {
      logger.error(`Service: Unexpected error deleting user by ID ${id}`, error);
      throw new Error('Database error while deleting user.');
    }
  };
};
