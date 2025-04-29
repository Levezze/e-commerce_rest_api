import bcrypt from 'bcrypt';
import { db } from './index.js';
import { logger } from '../utils/logger.js';
import { Users } from './types.js';
import { User } from '../dtos/user.js';
import { Insertable } from 'kysely';

type NewUserForDb = Insertable<Users>;

const seedAdminUser = async (): Promise<void> => {
  logger.debug('Attempting to seed admin into users db');
  try {
    const existingAdminUser = await db.selectFrom('users')
      .where('user_role', '=', 'admin')
      .executeTakeFirst();

    if (existingAdminUser) {
      logger.info("User 'admin' already exists.");
      return;
    };

    logger.debug('Hashing password with bcrypt');
        
    const saltRounds = 10;
    const hash = await bcrypt.hash('admin', saltRounds);

    const newUserDbData: Omit<NewUserForDb,
      'id' | 'created_at' | 'is_active' | 'last_login' | 'password_reset_expires' | 'password_reset_token'
      > = {
        username: 'admin',
        email: 'admin@erinwong.art',
        password: hash,
        user_role: 'admin'
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

    const adminUserResult = await db.insertInto('users')
      .values(newUserDbData)
      .returning(columnsToReturn)
      .executeTakeFirstOrThrow()
    
    logger.info(`Addmin user registered successfully: ${adminUserResult.email} (ID: ${adminUserResult.id})`);

    const userDto: User = {
      id: adminUserResult.id,
      username: adminUserResult.username,
      email: adminUserResult.email,
      role: adminUserResult.user_role,
      created_at: adminUserResult.created_at.toISOString(),
      updated_at: adminUserResult.updated_at.toISOString(),
      last_login: adminUserResult.last_login?.toISOString(),
    }

    logger.info(`Created admin user: ID ${userDto.id}, username: ${userDto.username}, role: ${userDto.role}`);
  } catch (error: any) {
    logger.error('Error during admin user seeding:', error);
    throw new Error('Error during admin user seeding:', error);
  };
};

seedAdminUser()
  .then(() => {
    logger.info('Admin user seeding process completed.');
  })
  .catch((err) => {
    logger.error('Admin user seeding failed:', err);
    process.exit(1);
  });