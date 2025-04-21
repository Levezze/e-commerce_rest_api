import { db } from '../../db/index';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';
import { User } from '../../dtos/user';


export const verifyCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {
  const userFromDb = await db.selectFrom('users')
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