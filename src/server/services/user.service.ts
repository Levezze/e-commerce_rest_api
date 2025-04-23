import { db } from '../../db/index.js';
import { logger } from '../../utils/logger.js';
import { User } from '../../dtos/user.js';

export const findUserById = async (id: number) => {
  logger.debug(`Service: Fetching to get user by ID: ${id}`);
  try {
    const dbUser = await db.selectFrom('users')
      .where('id', '=', id)
      .select(['id', 'username', 'email', 'user_role', 'created_at', 'updated_at', 'last_login'])
      .executeTakeFirst();

    if (!dbUser) {
      logger.warn(`Service: User with ID: ${id} not found.`);
      return null;
    };

    const userDto: User = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.user_role,
      created_at: dbUser.created_at?.toISOString(),
      updated_at: dbUser.updated_at?.toISOString(),
      last_login: dbUser.last_login?.toISOString(),
    };

    logger.debug({ userDtoFromService: userDto }, "Mapped user DTO in service");

    return userDto;
  } catch (error: any) {
    logger.error(`Service: Error fetching user by ID ${id}`, error);
    throw new Error('Database error while fetching user details.');
  };
};

export const getAllDbUsers = async () => {
  logger.debug(`Service: Fetching all users by admin`);
  try {
    const AllDbUsers = await db.selectFrom('users')
      .selectAll()
      .execute();

    if (!AllDbUsers) {
      logger.warn(`Service: Failed to fetch users / no users in db`)
      return null;
    }

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

    logger.debug({ userCount: usersDto.length }, "Mapped users DTO array in service");
    return usersDto;
  } catch (error: any) {
    logger.error(`Service: Error fetching all users`, error);
    throw new Error(`Database error while fetching all users.`);
  };
};
