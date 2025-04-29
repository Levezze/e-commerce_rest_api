import { db } from '../../database/index.js';
import { logger } from '../../utils/logger.js';
import { User } from '../../dtos/user.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';
import { sql, Selectable } from 'kysely';
import { Users as UsersTableInterface } from '../../database/types.js';

type SelectableDbUser = Selectable<UsersTableInterface>;

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

    const userDto: User = {
      id: userFromDb.id,
      username: userFromDb.username,
      email: userFromDb.email,
      role: userFromDb.user_role,
      created_at: userFromDb.created_at?.toISOString(),
      updated_at: userFromDb.updated_at?.toISOString(),
      last_login: userFromDb.last_login?.toISOString(),
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

    const usersDto: User[] = queryResult.rows.map(dbUser => {
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.user_role,
        created_at: dbUser.created_at?.toISOString(),
        updated_at: dbUser.updated_at?.toISOString(),
        last_login: dbUser.last_login?.toISOString(),
      }
    });

    if (AllDbUsers.length === 0) {
      logger.info('No users were found in the database') ;
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
