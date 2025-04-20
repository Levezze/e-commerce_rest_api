import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
