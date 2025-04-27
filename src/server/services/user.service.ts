import { db } from '../../db/index.js';
import { logger } from '../../utils/logger.js';
import { User } from '../../dtos/user.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';
import { sql, Selectable } from 'kysely';
import { Users as UsersTableInterface } from '../../db/types.js';

// export const findUserById = async (id: number) => {
//   logger.debug(`Service: Fetching to get user by ID: ${id}`);
//   try {
//     const dbUser = await db.selectFrom('users')
//       .where('id', '=', id)
//       .select(['id', 'username', 'email', 'user_role', 'created_at', 'updated_at', 'last_login'])
//       .executeTakeFirst();

//     if (!dbUser) {
//       throw new NotFoundError(`Service: User with ID: ${id} not found.`);
//     };

//     const userDto: User = {
//       id: dbUser.id,
//       username: dbUser.username,
//       email: dbUser.email,
//       role: dbUser.user_role,
//       created_at: dbUser.created_at?.toISOString(),
//       updated_at: dbUser.updated_at?.toISOString(),
//       last_login: dbUser.last_login?.toISOString(),
//     };

//     logger.debug({ userDtoFromService: userDto }, "Mapped user DTO in service");

//     return userDto;
//   } catch (error: any) {
//     if (error instanceof NotFoundError) {
//       throw error;
//     } else {
//       logger.error(`Service: Error fetching user by ID ${id}`, error);
//       throw new Error('Database error while fetching user details.');
//     }
//   };
// };



export const findUserById = async (id: number) => {
  logger.debug(`Service: Fetching to get user by ID: ${id}`);
  try {
    type SelectableDbUser = Selectable<UsersTableInterface>;
    const queryResult = await sql<SelectableDbUser>`
      SELECT id, username, email, user_role, created_at, updated_at, last_login
      FROM users
      WHERE id = ${id};
      `.execute(db)

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
    const AllDbUsers = await db.selectFrom('users')
      .selectAll()
      .execute();

    const usersDto: User[] = AllDbUsers.map(dbUser => {
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
    const dbUser = await db.selectFrom('users')
      .where('id', '=', id)
      .select(['id', 'username', 'email', 'user_role'])
      .executeTakeFirst();

    if (!dbUser) {``
      throw new NotFoundError(`User with ID ${id} not found.`);
    };

    if (dbUser.username === 'admin') {
      throw new ForbiddenError(`Cannot delete the primary admin user.`);
    };
    
    logger.debug(`User ${dbUser?.email} was found, proceeding to delete.`);

    await db.deleteFrom('users')
      .where('id', '=', id)
      .execute(); 

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
