import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types.js';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createResultParserInterceptor } from '../middlewares/validation.middleware.js';

dotenv.config();

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});